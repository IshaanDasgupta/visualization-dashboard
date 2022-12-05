const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const articleRoute = require('./routes/article');
const path = require('path');

const app = express();
dotenv.config();
app.use(express.json());

const connect = async ()=>{
    try{
        mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB database");
    }
    catch(err){
        throw err;
    }
}

app.use('/api', articleRoute);

__dirname = path.resolve();
if (process.env.NODE_ENV == 'production'){
    console.log(path.join(__dirname,"/client/build"));
    app.use(express.static(path.join(__dirname,"/client/build")));

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    })
}

app.use((err,req,res,next)=>{
    const errStatus = err.status || 500;
    const errMessage = err.message || "something went worng!"
    return res.status(errStatus).json({
        sucess:false,
        status:errStatus,
        message:errMessage,
        stack:err.stack
    })
})


const server = app.listen(process.env.PORT || 8800, ()=>{
    connect();
    console.log("server running on port 8800");
})
