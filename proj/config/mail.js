const nodemailer = require("nodemailer");
const {google} = require('googleapis');
const path = require('path');

const Hogan =require('hogan.js');
const fs = require('fs');
var template = fs.readFileSync('./views/index.hjs','utf-8');
var compiledTemplate=Hogan.compile(template);
//const hbs = require('nodemailer-express-handlebars');
const CLIENT_ID = '311600023632-ukcpltp1n3jagaaa19q8nsgrhs4v1ltn.apps.googleusercontent.com'
const CLIENT_SECRET =  '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04dHmsQdDIa07CgYIARAAGAQSNwF-L9Ir9PJhtn2Mve1vrwBtxXJNtCT0Qmc2VfBmvUNtPZWDCBCvT7zzD6kEmqdT6KKIFxr10ZI'
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})

const accesstoken = oAuth2Client.getAccessToken()
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type:'OAUTH2',
      user: 'mytestpetershiyam@gmail.com', 
      clientId: CLIENT_ID,
      clientSecret : CLIENT_SECRET,
      refreshToken : REFRESH_TOKEN,
      accessToken : accesstoken
    }
  });
module.exports ={transporter}