require("dotenv").config();
const userSchema = require("../../schema/user_schema");
const common = require('../../../config/common');
const Codes = require("../../../config/status_codes");
const md5 = require("md5");
const moment = require("moment")
const jwt = require('jsonwebtoken')
const { t } = require('localizify')
const path = require("path");

var user ={

    UserSignUp : async (req,res)=> {

        const existingEmailUser = await userSchema.findOne({ 
            $and: [{ email: req.email }, { is_active: '1' }, { is_delete: '0' }] });

        if (existingEmailUser) {
            return res.render(path.join(__dirname + '../../../../view/signup.ejs'),{
                message: t("Email_allready_register")
            })
        }

        const secretKey = process.env.SECRET_JWT;
        const token = jwt.sign({email:req.email},secretKey, {
            expiresIn: '7d'
        });

        const Md5Password = md5(req.password);

        const insertObj = {
          user_name: req.user_name,
          email: req.email,
          password: Md5Password,
          token:token
        };

        const newUser = new userSchema(insertObj);

        newUser.save().then(response => {

            return res.render(path.join(__dirname + '../../../../view/login.ejs'),{
                message: t("User_register")
            })
      
          }).catch(error => {

            return res.render(path.join(__dirname + '../../../../view/signup.ejs'),{
                message: t("Some_went_wrong")
            })

        }); 
    },

    Userlogin : async (req,res) => {

        try {

            const checkEmail = await userSchema.findOne({email : req.email})
            
            if(checkEmail != null){

                const CheckvalidPassword = md5(req.password);

                if(checkEmail.password == CheckvalidPassword){

                    const secretKey = process.env.SECRET_JWT;
                    const token = jwt.sign({_id:checkEmail._id},secretKey, {
                        expiresIn: '7d'
                    });
                    
                    await userSchema.findOneAndUpdate(
                        { _id : checkEmail._id}, 
                        {
                            $set : {
                                login_status : 'login',
                                updated_at :  moment().utc().format("YYYY-MM-DD HH:mm:ss") ,
                                token : token
                            }
                        }
                    ).then(response =>{
                        var ResData = {
                            key: '1',
                            message: t("User_login"),
                            _id: response._id,
                            user_name : response.user_name,
                            email :response.email
                        }
                        return res.render(path.join(__dirname + '../../../../view/dashboard.ejs'),
                        {ResData})

                    }).catch(Error => {
                        var ResData = {
                            key: '1',
                            message: t("Some_went_wrong")
                        }
                        return res.render(path.join(__dirname + '../../../../view/login.ejs'),{
                            ResData
                        })
                    })

                }else{
                    var ResData = {
                        key: '1',
                        message: t("Valid_email")
                    }
                    return res.render(path.join(__dirname + '../../../../view/login.ejs'),{
                        ResData
                    })
                }
                
            }else{

                var ResData = {
                    key: '1',
                    message: t("Credentials")
                }
                return res.render(path.join(__dirname + '../../../../view/login.ejs'),{
                    ResData
                })
            }

        } catch (error) {
            var ResData = {
                key: '1',
                message: t("Some_went_wrong")
            }
            return res.render(path.join(__dirname + '../../../../view/login.ejs'),{
                ResData
            })
        }
    },

    UserData : async (req,res) =>{
        try {
            
            const GatUserAllData = await userSchema.find({_id : req.user_id})
            if(GatUserAllData != ''){

                return common.sendResponse(res, Codes.SUCCESS, t("User_get_data"), GatUserAllData);

            }else{

                return common.sendResponse(res, Codes.ERROR, t("Some_went_wrong"), error);
            }
        } catch (error) {

            return common.sendResponse(res, Codes.ERROR, t("Some_went_wrong"), error);
        }
    },

    ChangePassword : async (req,res) => {

        try {

            const OldPassword = md5(req.old_password);
            const NewPassword = md5(req.new_password);

            const UserDeatils = await userSchema.findOne({ 
                $and: [{ _id: req._id }, { password: NewPassword }] });
            
            if(UserDeatils != undefined){
               
                var ResData = {
                    message: t("text_user_change_password_fail"),
                    _id:req._id,
                    key: '1',
                }
                
                return res.render(path.join(__dirname + '../../../../view/change_password.ejs'),{
                    ResData
                })

            }else{
                console.log(OldPassword);
                console.log(req._id);
                const GetUser = await userSchema.findOne({ 
                    $and: [{ _id: req._id },{ password: OldPassword }] });

                if(GetUser != undefined){

                    const updateParams = {
                        password: NewPassword,
                        updated_at: moment().utc().format("YYYY-MM-DD HH:mm:ss"),
                    };
                    const data = await userSchema.updateOne({ _id: req._id }, { $set: updateParams });

                    if(data){
                        var ResData = {
                            message: t("text_user_change_password_success"),
                            _id:req._id,
                            key: '1'
                        }
                        return res.render(path.join(__dirname + '../../../../view/login.ejs'),{
                            ResData
                        })

                    }else{
                        
                        var ResData = {
                            message: t("Some_went_wrong"),
                            _id:req._id,
                            key: '1'
                        }
                        return res.render(path.join(__dirname + '../../../../view/change_password.ejs'),{
                            ResData
                        })
                    }

                }else{

                    var ResData = {
                        message: t("text_old_new_password_same"),
                        _id:req._id,
                        key: '1'
                    }
                    return res.render(path.join(__dirname + '../../../../view/change_password.ejs'),{
                        ResData
                    })
                }
            }

        } catch (error) {
            var ResData = {
                message: t("Some_went_wrong"),
                _id:req._id
            }
            return res.render(path.join(__dirname + '../../../../view/change_password.ejs'),{
                ResData
            })
        }
    },


    Logout : async (req,res) => {
        
        try {
            
            const updateParams = {
                login_status: "Offline",
                token: "",
                updated_at: moment().utc().format("YYYY-MM-DD HH:mm:ss"),
            };

            const logoutData = await userSchema.updateOne({ _id: req }, { $set: updateParams });

            if(logoutData){
                var ResData = {
                    message: t("Logout")
                }
                return res.render(path.join(__dirname + '../../../../view/login.ejs'),{
                    ResData
                })

            }else{
                
                return res.render(path.join(__dirname + '../../../../view/dashboard.ejs'),{
                message: t("Some_went_wrong")
            })
            }

        } catch (error) {

            return res.render(path.join(__dirname + '../../../../view/dashboard.ejs'),{
                message: t("Some_went_wrong")
            })
        }
    }
}

module.exports = user;