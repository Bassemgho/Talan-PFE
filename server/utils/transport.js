import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path'
import jwt from 'jsonwebtoken'

const map = { userRole: "6240d8b36d0ad04caca79f00" }

const email = process.env.MAILER_EMAIL_ID || 'talandev2022@gmail.com'
const pass = process.env.MAILER_PASSWORD || 'PFEdev2022'
let transport = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
    auth: {
        user: email,
        pass: pass,
    },
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
    data.from = email
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