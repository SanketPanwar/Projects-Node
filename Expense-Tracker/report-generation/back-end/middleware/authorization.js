
const { json } = require('express/lib/response');
const jwt=require('jsonwebtoken')
const User=require('../models/user')

const authorization= (req,res,next)=>{
    const authHeader=req.header('authorization');
    const token=authHeader.split(' ')[1];
    console.log(token)
    if(!token)
    return res.status(401).json({success:false,message:"Token not found in header"})
    try {
        const response=jwt.verify(token,`${process.env.TOKEN_SECRET}`)
        User.findOne({where:{id:response.id}})
        .then(user=>{
            req.user=user
            next()
        })
        .catch(err=>{
            throw new Error(err)
        })

    } catch (err) {
        console.log(err)
        res.json({message:'Login again and try'});
    }

}

module.exports=authorization;