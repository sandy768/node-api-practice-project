require('dotenv').config();
const express=require('express');
const appServer=express();
const PORT=process.env.PORT||4700;
const mongoose=require('mongoose');
const path=require('path');
const cors=require('cors');

const apiRouter=require('./Router/apiRouter');
const userRouter=require('./Router/userRouter');

appServer.use(express.urlencoded({extended:true}));
appServer.use(express.json());
appServer.use(express.static(path.join(__dirname,"..","uploads","user")));

appServer.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader(
        'Cache-Control',
        'no-store, no-cache, must-revalidate, proxy-revalidate'
      );
    next();
  });
  
appServer.use(cors());
appServer.use(apiRouter);
appServer.use(userRouter);
mongoose.connect(process.env.DB_URL)
.then(res=>{
    appServer.listen(PORT,()=>{
        console.log(`Server is running at http://localhost:${PORT}`);
    })
})
.catch(err=>{
    console.log("Database not connected yet",err);
})
