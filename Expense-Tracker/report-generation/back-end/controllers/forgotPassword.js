const Password=require('../models/password')
const User=require('../models/user')
const bcrypt=require('bcrypt')

const {v4:uuidv4}=require('uuid')

exports.forgotPassword=(req, res, next)=>{
    const email=req.body.email;
    const uuid=uuidv4();
    User.findOne({where:{email:email}})
    .then(user=>{
        if(!user)
        return res.json({success:false,message:'User not Registered. Please Sign Up'})
        else{
            user.createPassword({uuid:uuid,isActive:true})
            .then(()=>{
                return res.status(201).json({success:true,message:`Use this link to reset Password : http://localhost:5000/password/resetpassword/${uuid}`})
            })
            .catch(err=>{
                throw new Error(err)
            })
        }

    })
    .catch(err=>{
        console.log(err)
        res.json({error:err})
    })
}

exports.resetPassword=(req, res, next)=>{
    const uuid=req.params.uuid;
    Password.findOne({where:{uuid:uuid}})
    .then((link)=>{
        if(!link)
            return res.status(404).json({success:false,message:'Invalid Link'})
        else{
            const userId=link.userId;
            const isActive=link.isActive;
            if(!isActive)
                return res.send('Link Expired : Reset Password again')
                //return res.json({success:false,message:'Link expired. Reset password Again'})

            return res.send(`<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Reset Password</title>
                </head>
                <body>
                    <div id="div" style="display:flex; flex-direction:column; margin-top:10rem; align-items:center; justify-content:center;">
                        <h3>Enter Your New Password</h3>
                        <form id="form" action="http://localhost:5000/password/updatepassword" method="POST">
                        <label for="password">Password:</label>
                        <input type="password"  id="password" name="password" required>
                        <br><br>
                        <input type="hidden"  id="userId" name="userId" value="${userId}" required>
                        <input type="hidden"  id="uuid" name="uuid" value="${uuid}" required>
                
                        <button type="submit" style="cursor:pointer;">Reset Password</button>
                        </form>
                    </div>

                </body>
                </html>`)
            //return res.status(200).json({success:true,message:'Reset Your Password',userId:userId,uuid:uuid})
        }
    })
    .catch((err)=>{
        console.log(err)
        res.json({error:err})
    })
}

exports.updatePassword=async(req, res, next)=>{
    const newPassword=req.body.password;
    const userId=req.body.userId;
    const uuid=req.body.uuid
    try {
        const user=await User.findOne({where:{id:userId}})
        const hashedPassword=await bcrypt.hash(newPassword,10);
        user.update({password:hashedPassword})
        const request=await Password.findOne({where:{uuid:uuid}})
        request.update({isActive:false})
        res.send('Password Succesfully Updated')
        //res.status(201).json({sucess:true,message:'Password Successfully Updated.'})
    } catch (err) {
        console.log(err)
        res.json({error:err})
    }


}