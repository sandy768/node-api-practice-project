const UserModel=require('../Model/apiModel');
const bcrypt=require('bcryptjs');
const path=require('path');
const fs=require('fs');

const postUser=async(req,res)=>{
    try{
        if(!req.body.name){
            return res.status(401).json({
                success:false,
                message:"Username is required"
            })
        }
        else if(!req.body.gender){
            return res.status(401).json({
                success:false,
                message:"Gender is required"
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
            let mail_verify=await UserModel.findOne({email:req.body.email});
            if(!mail_verify){
                let hashPassword=await bcrypt.hash(req.body.password,12);
                let user_img=req.files.map(image=>image.filename);
                let user_details=new UserModel({
                    name:req.body.name.toLowerCase(),
                    gender:req.body.gender.toLowerCase(),
                    email:req.body.email,
                    password:hashPassword,
                    user_image:user_img,
                });
                let user_data=await user_details.save();
                console.log("User details saved successfully");
                
                if(user_data){
                    return res.status(200).json({
                        success:true,
                        message:"User Details saved successfully",
                    })
                }
            }
            else{
                return res.status(201).json({
                    success:false,
                    message:"Email already exists"
                })
            }
        }
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:"Error while collecting the data"+err
        })
    }
}

const getUser=async(req,res)=>{
    try{
        let viewUser=await UserModel.find().select(
            '_id name gender email password user_image'
        );
        if(viewUser){
            return res.status(201).json({
                success:true,
                message:"User details fetched successfully",
                result:viewUser,
            });
        } 
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:"Error while fetching user details"+err
        })
    }
}

const updateUser=async(req,res)=>{
    try{
        if(!req.body.name){
            return res.status(401).json({
                success:false,
                message:"Username is required"
            })
        }
        else if(!req.body.gender){
            return res.status(401).json({
                success:false,
                message:"Gender is required"
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
            let user_id=req.params.id;
            let hashPassword=await bcrypt.hash(req.body.password,12);
            let existing_user=await UserModel.findById(user_id);
            existing_user.name=req.body.name.toLowerCase()||existing_user.name;
            existing_user.gender=req.body.gender.toLowerCase()||existing_user.gender;
            existing_user.email=req.body.email||existing_user.email;
            existing_user.password=hashPassword||existing_user.password;
            if(req.files==[]){
                existing_user.user_image=existing_user.user_image;
            }
            else{
                existing_user.user_image.forEach(images=>{
                    fs.unlinkSync(path.join(__dirname,"..","uploads","user",images));
                })
                let new_image=req.files.map(image=>image.filename);
                existing_user.user_image=new_image;
            }
            let updated_data=await existing_user.save();
            console.log("User details successfully updated");        
            if(updated_data){
                return res.status(200).json({
                    success:true,
                    message:"User details successfully updated",
                    result:updated_data,
                });
            }
        }
    }
    catch(err){
        console.log("Error to update data",err);

        return res.status(401).json({
            success:false,
            message:"Error to update user details"+err,
        });
    }
}

const deleteUser=async(req,res)=>{
    try{
        let deleteUser=await UserModel.findOneAndDelete({_id:req.params.id});
        console.log("Deleted user:",deleteUser);
        if(deleteUser){
            deleteUser.user_image.forEach(images=>{
                fs.unlinkSync(path.join(__dirname,"..","uploads","user",images));
            })
            return res.status(201).json({
                success:true,
                message:"User details deleted successfully",
                result:deleteUser,
            });
        }
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:"Error to delete user details"+err,
        });
    }
}

module.exports={
    postUser,
    getUser,
    updateUser,
    deleteUser
}