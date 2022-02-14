require('dotenv').config()
const { append } = require('express/lib/response');
const jwt=require('jsonwebtoken')


authorization=((data)=>{
    const token=jwt.sign(JSON.stringify(data),process.env.security)
    return token;
})

authentication=((req,res,next)=>{
    if(req.headers.cookie){
        const token=req.headers.cookie.split('=')[1]
        const data=jwt.verify(token,process.env.security)
        req.userData=data
        next()
    }else{
        next(res.status(404).send({Message:'not logged in yet'}))
    }
})



module.exports={authorization,authentication}