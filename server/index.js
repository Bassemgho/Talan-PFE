import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors"
import http from 'http'
import morgan from 'morgan'
import {Server} from 'socket.io'
import path from 'path'
import authrouter from "./routes/auth.js"
import errorHandler from "./middlewares/errorHandler.js";
import adminRouter from './routes/admin.js'
import eventRouter from './routes/event.js'
import chatRouter from './routes/chat.js'
import filesRouter from './routes/file.js'
import protectsocket from './middlewares/socketprotection.js'
import sockethandler from './socket/sockethandler.js'

const app = express();
const httpserver = http.createServer(app)
export const io = new Server(httpserver,{
  cors: {
    origin: '*',
    credentials:true
  }
})
app.disable('etag');
app.set('socket',io)
// app.set('view engine', 'html');
// console.log(path .dirname());
// app.get('/*', function(req, res) {
//   res.sendFile('/home/bassem/Desktop/Front/template/build/index.html', function(err) {
//     if (err) {
//       res.status(500).send(err)
//     }
//   })
// })
// app.use(express.static('/home/bassem/Desktop/Front/template/build'));
io.use(protectsocket)
app.use(bodyParser.json({limit:"30mb",extended:true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}));
app.use(cors())
app.use(morgan('dev'))
app.use(authrouter)
app.use(adminRouter)
app.use(adminRouter)
app.use(eventRouter)
app.use(filesRouter)
app.use(chatRouter)
// app.use("/",(req,res) => { res.status(201).json({
//     success:true,
//     message:"helloworld"
//
//
// })
// return
// })
io.on('connection',(socket)=>{
  console.log('user has connected:',socket.id);
  sockethandler(socket)
})
app.use(errorHandler)
const PORT = process.env.PORT || 5000 ;
// fixer lien mongo
const CONNEXION_URL = "mongodb+srv://pfeuser:pfeuser@cluster0.trqml.mongodb.net/Talan-2022?retryWrites=true&w=majority"
mongoose.connect(CONNEXION_URL)
.then(()=>{httpserver.listen(PORT,console.log(`server  running on port : ${PORT}`))})
.catch((error)=>{console.log(error.message)})
