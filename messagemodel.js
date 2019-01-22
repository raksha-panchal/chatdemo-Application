var mongoose=require('mongoose');
var messageSchema= new mongoose.Schema({
    content:{type:String},
    contentType:{type:String,enum:['message','file'],default:'message'},
    roomId:{type:mongoose.Schema.Types.ObjectId,ref:'room'},
    senderId:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    receiverId:[{type:mongoose.Schema.Types.ObjectId,ref:'user'}],
    status:{type:String,enum:['seen','unseen'],default:'unseen'},
    createdAt:{type:Date,default:Date.now}

})
 module.exports= mongoose.model('message',messageSchema)