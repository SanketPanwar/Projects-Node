const Razorpay=require('razorpay')
const User=require('../models/user')
const Order=require('../models/order')


exports.premiumOrderGeneration=(req, res, next)=>{
    var instance=new Razorpay({
        key_id:process.env.KEY_ID,
        key_secret:process.env.KEY_SECRET
    })
    var options = {
      amount: req.body.amount,  // amount in the smallest currency unit
      currency: "INR",
      receipt: "order_rcptid_11"
    };
    instance.orders.create(options,(err, order)=>{
        if(err){
            console.log(err)
        }
      else  
      res.status(201).json({order})
    })
}

exports.updateTransactionDetails=(req,res,next)=>{
    req.user.update({isPremium:true})
    .then()
    .catch(err=>{
        console.log(err)
        return res.json({error:err})
    })
    req.user.createOrder({
        orderId:req.body.orderId,
        paymentId:req.body.paymentId
    })
    .then()
    .catch(err=>{
        console.log(err)
        res.json({error:err})
    })
}