const express=require('express');
const router=express.Router();
const AuthJwt=require('../middle-ware/isAuth');
const {postReg,postLog,viewUser}=require('../Controller/userController');

router.post('/user/regdata',postReg);
router.post('/user/logdata',postLog);
router.get('/user/view',AuthJwt.authJwt,viewUser);

module.exports=router;