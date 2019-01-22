var usermodel = require('./usermodel')
var bcrypt = require('bcrypt')
var messagemodel = require('./messagemodel')
var roommodel = require('./roommodel')
var util1 = require('./util.js')
var cloudinary = require('cloudinary')
cloudinary.config({
    cloud_name: 'dyxq6qusc',
    api_key: 768427637163896,
    api_secret: 'C-9_ibjyCuctlwLWNxOEwbrOMWk',
})

async function signup(req, res) {
    var user = new usermodel(req.body)
    var pass = await bcrypt.hash(req.body.password, 10);
    user.password = pass;
    user.save((err, data) => {
        if (err) {
            return res.json({ code: 500, message: "Internal Server Error" })
        } else {
            return res.json({ code: 200, message: "ok", data })
        }
    })
}

function login(req, res) {
    usermodel.findOne({ $or: [{ phoneNo: req.body.phoneNo }, { email: req.body.email }] }).then((result) => {
       if (!result) {
            return res.json({ code: 400, message: "Please check EmailId or PhoneNo" })
        }
        var password = req.body.password;
        bcrypt.compare(password, result.password).then((data) => {
            if (data == true) {
                usermodel.findOneAndUpdate({_id:result._id},{$set:{status:'Active'}}).then((data2)=>{
                    // return res.json({ code: 200, message: "Login Successfully", result })

                 })
                return res.json({ code: 200, message: "Login Successfully", result })
           }
            return res.json({ code: 404, message: "Please check password" })
        })
    }).catch((err) => {
        console.log(err)
        return res.json({ code: 500, message: "Internal Server Error" })
    })
}

function getuser(req, res) {
    usermodel.find({ _id: { $nin: req.params.id } }).then((result) => {
        return res.json({ code: 200, message: "ok", result })
    }).catch((err) => {
        console.log(err)
        return res.json({ code: 500, message: "Internal server error" })
    })
}

function getGroup(req,res){
    roommodel.find({participants:{$in:req.params.id},chattype:'group'}).then((result)=>{
        return res.json({code:200,message:"ok",result})
    }).catch((err)=>{
        return res.json({code:500,message:"Internal server error"})
    })
}

function getmessage(req, res) {
    messagemodel.find({ roomId: req.params.id }).populate('senderId').then((result) => {
        return res.json({ code: 200, message: "ok", result })
    }).catch((err) => {
        return res.json({ code: 500, message: "Internal server error" })
    })
}

function logout(req,res){
   usermodel.findOneAndUpdate({_id:req.params.id},{$set:{status:'InActive'}}).then((result)=>{
      return res.json({code:200,message:"logout successfully",result})
    }).catch((err)=>{
        return res.json({code:500,message:"Internal Server Error"})
    })
}

 async  function imageupload1(req, res) {
    req.newFile_name=[];
    util1.upload(req, res,  function (err) {
       if (err) {
            return res.json({ code: 500, message: "Internal Server Error" })
        }
        else {
         var filePaths = req.newFile_name;
        //  console.log(filePaths)
        res.json({ code: 200, message: "uploaded successfully",URL:filePaths})
       }
    });
}

module.exports = {
    signup,
    login,
    getuser,
    getmessage,
    getGroup,
    logout,
    imageupload1
}