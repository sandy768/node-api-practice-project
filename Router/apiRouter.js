const express=require('express');
const router=express.Router();
const multer=require('multer');
const path=require('path');
const {postUser,getUser,updateUser,deleteUser} = require('../Controller/apiController');

const fileStorage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,path.join(__dirname,"..","uploads","user"),(err,data)=>{
            if(err) throw err;
        })
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname,(err,data)=>{
            if(err) throw err;
        })
    },
});
const fileFilter=(req,file,callback)=>{
    if(
        file.mimetype.includes("png")||
        file.mimetype.includes("jpg")||
        file.mimetype.includes("jpeg")||
        file.mimetype.includes("webp")
    ){
        callback(null,true);
    }
    else{
        callback(null,false);
    }
}
const upload=multer({
    storage:fileStorage,
    fileFilter:fileFilter,
    limits:{fieldSize:1024*1024*5},
});
const upload_type=upload.array('user_image',2);

router.post('/postdata',upload_type,postUser);
router.get('/getdata',getUser);
router.put('/updatedata/:id',upload_type,updateUser);
router.delete('/deletedata/:id',deleteUser);

module.exports=router;