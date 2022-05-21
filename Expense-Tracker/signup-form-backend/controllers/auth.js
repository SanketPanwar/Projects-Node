const User=require('../models/user')
const bcrypt=require('bcrypt');

exports.register=(req,res,next)=>{
    const {name,email,password,phone}=req.body

    bcrypt.hash(password,10, (err,hash)=>{

        User.findAll({where:{email:email}})
        .then(users=>{
            const user=users[0]
            if(user)
            res.json({success:false,message:'User Already exist. Please Login'})
            else
            {   
                User.create({
                    name:name,
                    email:email,
                    password:hash,
                    phone:phone
                })
                .then(()=>{
                    res.status(200).json({success:true,message:'Successfully Signed Up, Login now'})
                })
                .catch(err=>{
                    console.log(err)
                    res.json({success:false,message:'error while registering'})
                })

            }
        })
    })
}
