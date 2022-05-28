const express=require('express')

const router=express.Router();
const forgotPasswordController=require('../controllers/forgotPassword')

router.post('/forgot/password',forgotPasswordController.forgotPassword)
router.get('/password/resetpassword/:uuid',forgotPasswordController.resetPassword)
router.post('/password/updatepassword',forgotPasswordController.updatePassword)

module.exports=router;