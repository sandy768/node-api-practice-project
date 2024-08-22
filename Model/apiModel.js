const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UserSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    user_image:{
        type:[String],
        required:false
    }
},{
    timestamps:true,
    versionKey:false
})
const UserModel=new mongoose.model('user_details',UserSchema);
module.exports=UserModel;