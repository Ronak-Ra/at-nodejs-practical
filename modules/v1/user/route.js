const express = require('express');
const router = express.Router();
const user_model = require('./model');
const common = require('../../../config/common');

router.post('/Signup' , async (req,res) => {

    const request = req.body
    console.log("Requeswt", request)
    const Addsignupdata = {
        user_name : "required",
        email : "required",
        password : "required"
    }
    const SignupData = {
        user_name : request.user_name,
        email : request.email,
        password : request.password
    }
    if(common.checkValidation(request,Addsignupdata,res)){
        await user_model.UserSignUp(SignupData,res, function(resCode, resMsg, resdata){
            common.sendResponse(res, resCode, resMsg, resdata)
        });
    }
});

router.post('/login', async (req,res) => {
    const request = req.body;
    const login = {
        email:"required",
        password:"required"
    }
    const userLogin = {
        email : request.email,
        password : request.password
    }
    if(common.checkValidation(request,login,res)){
        await user_model.Userlogin(userLogin,res, function(resCode,resMsg,resData){
            common.sendResponse(res,resCode,resMsg,resData)
        });
    }
});

router.get('/GetUserData',async (req,res)=> {
    const request = req.body
    const GetData = {
        user_id :"required"
    }
    const GatUserAllData = {
        user_id : request.user_id
    }
    if(common.checkValidation(request,GetData,res)){
        await user_model.UserData(GatUserAllData,res, function(resCode, resMsg, resdata){
            common.sendResponse(res, resCode, resMsg, resdata)
        });
    }
});

router.post('/change_password' , async (req,res) => {
    const request = req.body
    const PasswordReq = {

        user_id : 'required',
        old_password : 'required',
        new_password : 'required'
    }
    const PasswordData = {
        _id : request.user_id,
        old_password : request.old_password,
        new_password : request.new_password
    }
    if(common.checkValidation(request,PasswordReq,res)){
        await user_model.ChangePassword(PasswordData,res, function(resCode, resMsg, resdata){
            common.sendResponse(res, resCode, resMsg, resdata)
        });
    }
})


router.post('/logout' ,async (req,res) => {
    const request = req.body

    const LogoutRequired = {
        user_id :"required"
    }
    if(common.checkValidation(request,LogoutRequired,res)){
        await user_model.Logout(request.user_id,res, function(resCode, resMsg, resdata){
            common.sendResponse(res, resCode, resMsg, resdata)
        });
    }
});


module.exports = router
