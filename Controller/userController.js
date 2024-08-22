const AuthModel=require('../Model/userModel');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const postReg=async(req,res)=>{
    try{
        if(!req.body.username){
            return res.status(401).json({
                success:false,
                message:"Username is required"
            })
        }
        else if(!req.body.age){
            return res.status(401).json({
                success:false,
                message:"Age is required"
            })
        }
        else if(!req.body.email){
            return res.status(401).json({
                success:false,
                message:"Email is required"
            })
        }
        else if(!req.body.password){
            return res.status(401).json({
                success:false,
                message:"Password is required"
            })
        }
        else{
            let mail_verify=await AuthModel.findOne({email:req.body.email});
            if(!mail_verify){
                if(req.body.password===req.body.cnfpassword){
                    let hashPassword=await bcrypt.hash(req.body.password,12);
                    let details=new AuthModel({
                        username:req.body.username.toLowerCase(),
                        age:req.body.age,
                        email:req.body.email,
                        password:hashPassword,
                    });
                    let save_details=await details.save();
                    return res.status(200).json({
                        success:true,
                        message:"Registration successfully done",
                        result:save_details,
                    });
                }
                else{
                    return res.status(401).json({
                        success:false,
                        message:"Password does not match",
                    });
                }
            }
            else{
                return res.status(401).json({
                    success:false,
                    message:"User already exists, Please go to login",
                });
            }
        }
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:"Error while collecting user data"+err,
        });
    }
}

const postLog=async(req,res)=>{
    try{
        if(!req.body.email){
            return res.status(401).json({
                success:false,
                message:"Email is required",
            });
        }
        else if(!req.body.password){
            return res.status(401).json({
                success:false,
                message:"Password is required",
            });
        }
        else{
            let user_exists=await AuthModel.findOne({email:req.body.email});
            if(user_exists){
                let password_match=await bcrypt.compare(req.body.password,user_exists.password);
                if(password_match){
                    let token_payload={userdata:user_exists};
                    let jwt_token=jwt.sign(token_payload,process.env.SECRET_KEY,{
                        expiresIn:"1h",
                    });
                    return res.status(200).json({
                        success:true,
                        message:"Login successfully done",
                        status:200,
                        token:jwt_token,
                    });
                }
                else{
                    return res.status(401).json({
                        success:false,
                        message:"Incorrect password",
                    });
                }
            }
            else{
                return res.status(401).json({
                    success:false,
                    message:"Invalid email"
                })
            }
        }
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:"Error to collect login credentials"+err,
        });
    }
} 

const viewUser=async(req,res)=>{
    try{
        let view_details=req.user.userdata;
        return res.status(200).json({
            success:true,
            message:"User details fetch successfully",
            status:200,
            result:view_details,
        });
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:"Error to fetch user data"+err,
            status:401,
        });
    }
}
module.exports={
    postReg,
    postLog,
    viewUser
}