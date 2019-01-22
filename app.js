var express = require('express')
var app = express();
var config = require('./config')
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
var useraction = require('./useraction')
var roommodel = require('./roommodel')
var messagemodel = require('./messagemodel')
var http = require('http')
var cors = require('cors')

app.use(cors())
app.use(bodyParser.json())
// function app(req,res){
//     res.writeHead(200, {
//     'Access-Control-Allow-Origin' : '*'
//     });
//     };
// app.use(function(req, res, next) {														
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

app.use("/img",express.static(__dirname + '/img'));

// const corsUrls = (config.URL || '*').split(',');

// app.use(cors({
//   origin: (origin, cb) => cb(null, corsUrls.includes('*') || corsUrls.includes(origin)),
//   credentials: true,
// }))

mongoose.connect(config.URL)

var serve = http.createServer(app)
var io = require('socket.io')(serve)

io.on('connection', function (socket) {
   console.log("INNNNNNNNNNNNNNNN")
    socket.on('join', function (data) {
        roommodel.findOne({ $and: [{ participants: { $in: data.id } }, { participants: { $in: data.rid } }] }, (err, data1) => {
            if (err) {
                console.log(err)
            } else if (!data1) {
                var user = new roommodel(data)
                user.participants = [data.id, data.rid]
                user.save((err, data2) => {
                    socket.emit('room', data2)
                })
            } else {
               socket.emit('roomData', data1)
                roommodel.findOne({ _id: data1._id }).populate('participants').then((result1) => {
                    var result = result1.participants.filter((data2) => {
                      if (data2._id != data.id) {
                            return data2
                        }
                    })
                  io.emit('msg1', { roomId: result1._id, status: result[0].status })
                })

            }
        })
    })

    socket.on('Cgroup', function (data) {
        var user = new roommodel(data)
        user.save((err, result) => {
            socket.emit('grouproom', result)
        })
    })

    // socket.on('msg', function (data) {
    //    roommodel.findOne({ _id: data.rid }).populate('participants').then((result) => {
    //         console.log("in msg",result)
    //        var result1 = result.participants.filter((data2) => {
    //            console.log(data2)
    //            console.log(data.id)
    //             if (data2._id != data.id) {
    //                return data2
    //             } else {
    //                 name = data2.name
    //             }
    //         })
    //         console.log(result1)
    //         io.emit('msg1', {  roomId: result._id ,status:result1[0].status})
    //     })
    // })

    socket.on('typing', function (data) {
        console.log(data.roomid)
        roommodel.findOne({ _id: data.roomid }).populate('participants').then((data1) => {
            var name;
            var dataid = [];
            var result = data1.participants.filter((data2) => {
                if (data2._id != data.id) {
                    dataid.push(data2._id)
                } else {
                    name = data2.name
                }
            })
            io.emit('in typing', { data: dataid, roomId: data1._id, name: name })
        })
    })


    socket.on('send', function (data) {
        io.emit('click',data)
        roommodel.findOne({ _id: data.roomId }).then((data1) => {
            var result = data1.participants.filter((data2) => {
                if (data2 != data.senderId) {
                    return data2
                }
            })
            var user1 = new messagemodel(data)
            user1.receiverId = result
            user1.save((err, result2) => {
                if (err) {
                    console.log(err)
                } else {
                    messagemodel.findOne({ _id: result2._id }).populate('senderId').populate('receiverId').then((result3) => {
                        io.emit('message', { user: result3.senderId.name, message: result3.content, messageId: result3._id, roomId: result3.roomId, status: result3.receiverId[0].status })

                    })
                }
            })
        }).catch((err) => {
            console.log(err)
        })
    })

    socket.on('messageto', function (data) {
        messagemodel.findOne({ roomId: data.roomId, _id: data.messageId }).populate('receiverId').populate('senderId').then((result) => {
            if (result.receiverId[0].status == 'Active') {
                messagemodel.findOneAndUpdate({ _id: result._id }, { $set: { status: 'seen' } }, { new: true }).populate('senderId').populate('receiverId').then((result1) => {
                    socket.emit("get", result1)
                })
            } else {
              socket.emit('get', result)
            }
        })
    })

    // socket.on('uploadedimage',function(data){
    //   console.log("in image uploadede",data)
    // })
  

    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });

});


app.post('/signup', (req, res) => {
    useraction.signup(req, res)
})
app.post('/login', (req, res) => {
    useraction.login(req, res)
})

app.post('/logout/:id', (req, res) => {
    useraction.logout(req, res)
})

app.get('/getuser/:id', (req, res) => {
    useraction.getuser(req, res)
})

app.get('/getGroup/:id', (req, res) => {
    useraction.getGroup(req, res)
})
app.get('/getmessage/:id', (req, res) => {
    useraction.getmessage(req, res)
})

app.post('/imageupload1', (req, res) => {
   useraction.imageupload1(req, res)
})

serve.listen(config.port, () => {
    console.log(`server listening on ${config.port}`)
})