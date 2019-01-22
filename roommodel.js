var mongoose=require('mongoose');

var roomSchema= new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref:'user'}],
    createdAt:{type:Date,default:Date.now},
    chattype:{type:String,enum:['private','group'],default:'private'},
    groupName:{type:String}
  
})

module.exports= mongoose.model('room',roomSchema)