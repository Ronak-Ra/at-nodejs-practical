require("dotenv").config();
const express = require("express");
const path = require("path");
const con = require('./config/database')
const app = express();
const en = require("./languages/en");
const { t } = require('localizify');
const { default: localizify } = require('localizify');
const cors = require('cors')
const ejs = require('ejs')
var bodyParser = require('body-parser');
const userSchema = require("./modules/schema/user_schema");
const user_model = require('./modules/v1/user/model')


var user = require("./modules/v1/user/route");
// app.use('/api', api);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());  

app.use((request, response, next) => {

  if(request.headers['accept-language'] == "en" )
  {
      localizify.add('en', en).setLocale('en');

  }
  else if(request.headers['accept-language'] == "ar" )
  {   
      localizify.add('ar', ar).setLocale('ar');

  }
  else
  {
      localizify.add('en', en).setLocale('en');

  }
  next();
});

app.use("/v1/user", user);

app.get('/register', function (req, res) {
  res.render(path.join(__dirname + '/view/signup.ejs'))
})

app.get('/login', function (req, res) {
  res.render(path.join(__dirname + '/view/login.ejs'))
})

app.get('/dashboard/:userId', async function (req, res) {
  const userId = req.params.userId;
  const GatUserAllData = await userSchema.find({_id : userId})
  res.render(path.join(__dirname + '/view/dashboard.ejs'),{ResData:GatUserAllData[0]})
})

app.get('/logoutUser/:userId', async function (req,res) {
  const userId = req.params.userId;
  user_model.Logout(userId,res,(res) => {});
})

app.get('/changepassword/:userId', async function (req, res) {
  const userId = req.params.userId;
  const GetData = await userSchema.find({_id : userId})
  res.render(path.join(__dirname + '/view/change_password.ejs'),{ResData:GetData[0]})
})

app.use('*', async function(req,res){
  res.redirect('/login')
})

try {
  var server = app.listen(process.env.PORT);
  console.log(
    `${process.env.APP_NAME} server is starting on ${process.env.PORT} port`
  );
} catch (error) {
  console.log(`error in server files =>`, error);
}