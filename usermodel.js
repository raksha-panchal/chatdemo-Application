var mongoose=require('mongoose')
// var schema=mongoose.Schema;

var userSchema= new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    phoneNo:{type:Number,required:true,unique:true},
    password:{type:String},
    status:{type:String,enum:['Active','InActive'],default:'InActive'}
})

module.exports=mongoose.model('user',userSchema)