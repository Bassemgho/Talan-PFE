import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'
import jwt from 'jsonwebtoken'

const map = { userRole: "6240d8b36d0ad04caca79f00" }

const mail = process.env.MAILER_EMAIL_ID || 'talandev2022@gmail.com'
const pass = process.env.MAILER_PASSWORD || 'PFEdev2023'
let transport = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
    auth:{
      type: 'OAuth2',
      user:mail,
      pass:pass,
      clientId:'834985114594-hd92eo90c1c65tm2liuii3cciatbqne9.apps.googleusercontent.com',
      clientSecret:'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',
      refreshToken: '1//04vJObVK64qrXCgYIARAAGAQSNwF-L9Ir6aIMbic0E3KRBxtTP0M878_rdMAiX-dV-OMS2XcksXeepovjHmxxBAt5kRNgm7T6KM0'
      // accessToken:'AIzaSyB4FFd9bZl1lT_l6Cff-7GfmCCrRx2IP4A'
  }
});
let handlebarsOptions = {
    viewEngine: {
        extName: ".html",
        partialsDir: path.resolve('../templates'),
        defaultLayout: false
    },
    viewPath: path.resolve('../templates/'),
    extName: '.html'
};
transport.use('compile', hbs(handlebarsOptions))
export const sendMail  = (data,next) => {
    // data.to = to;
    data.from = mail
    transport.sendMail(data,function(err){
        if(err){
            return next('error',404)
        }else{
            // next()
            console.log('done')
        }
    })


 }
export default transport
