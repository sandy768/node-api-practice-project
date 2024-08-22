const mongoose=require('mongoose');
const AuthSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true,
    versionKey:false,
});
const AuthModel=new mongoose.model("auth_details",AuthSchema);
module.exports=AuthModel;