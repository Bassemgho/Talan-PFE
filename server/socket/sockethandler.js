import events from '../models/event.js'
import rooms from '../models/room.js'
import message from '../models/message.js'
import polls from '../models/poll.js'
import optionsDB from '../models/option.js'
import {io } from '../index.js'
let socketList = {}
const findRoom = async function (id,select=false) {
  try {
    // const evet = await events.findOne({_id:id})
    if (!select) {

      const room = await rooms.findOne({event:id}).select('+messages')
      console.log('room',room);
      return room;
    }
    const room = await rooms.findOne({event:id}).select('+messages').populate('messages')
    return room;
    // il faut fixer les donnees pour le moment en utilise le eventid
    // const room = await rooms.find({_id:id})
  } catch (e) {
    console.log(e.message);
    return null;  //   try {
  //     axios.get('http://localhost:5000/')
  //   } catch (e) {
  //     throw new Error(e)
  //   }
  // }
  }
}
const sockethandler =  (socket)=>{
  socket.on('disconnect', () => {
      socket.disconnect();

      console.log('User disconnected!');
    });
  socket.on('BE-check-user', ({ roomId, userName }) => {
    let error = false;

    io.sockets.in(roomId).clients((err, clients) => {
      clients.forEach((client) => {
        if (socketList[client] == userName) {
          error = true;
        }
      });
      socket.emit('FE-error-user-exist', { error });
    });
  })
  socket.on('BE-join-room',async ({eventid})=>{
    socket.join(eventid)

    socketList[socket.id.toString()]= {userName:`${socket.user.firstname} ${socket.user.lastname}`,avatar:socket.user.avatar,video:true, audio:true}
    console.log('soocketlist',socketList);
    try {
      const users = []
      // const clients  =await io.in(eventid).fetchSockets();
      const clients = io.sockets.adapter.rooms.get(eventid);
      clients.forEach((client) => {
        users.push({userId:client,info:socketList[client]})
      });
console.log(users);
     socket.broadcast.to(eventid).emit('FE-user-join', users);

    } catch (e) {
      io.sockets.in(eventid).emit('FE-error-user-exist', { err: true ,message:e.message});
      console.log(e.message);
    }

    // io.sockets.in(eventid).clients((err,  clients)=>{
    //   try {
    //     const users = [];
    //     clients.forEach((client) => {
    //       users.push({userId:client,info:socketList[client]})
    //
    //     });
    //     socket.broadcast.to(eventid).emit('FE-user-join', users);
    //   } catch (e) {
    //     io.sockets.in(roomId).emit('FE-error-user-exist', { err: true });
    //   }
    // })
  });
  socket.on('BE-call-user', ({ userToCall, from, signal }) => {
    io.to(userToCall).emit('FE-receive-call',{
      signal,from,info:socketList[socket.id]

    })

});
socket.on('BE-accept-call', ({ signal, to }) => {
  io.to(to).emit('FE-call-accepted',{signal,answerId:socket.id})
});
socket.on('BE-send-message', async ({ eventid, msg, sender }) => {
  const room = await findRoom(eventid)
  // console.log(sender);

  const ms = await room.addMessage({msg,sender})
  // console.log('message in server ',ms);
// io.sockets.in(eventid).emit('FE-receive-message', { msg, sender });
io.sockets.in(eventid).emit('FE-receive-message', { msg:ms });

});
socket.on('BE-leave-room', ({ eventid, leaver }) => {
  delete socketList[socket.id];
    socket.broadcast
      .to(eventid)
      .emit('FE-user-leave', { userId: socket.id, userName: [socket.id] });
    io.sockets.sockets[socket.id].leave(eventid);
});

  socket.on('BE-toggle-camera-audio', ({ eventid, switchTarget }) => {
    if (switchTarget === 'video') {
         socketList[socket.id].video = !socketList[socket.id].video;
       } else {
         socketList[socket.id].audio = !socketList[socket.id].audio;
       }
       socket.broadcast
         .to(eventid)
         .emit('FE-toggle-camera', { userId: socket.id, switchTarget });
  });
  socket.on('client-fetsh-messages-id',async ({id}) => {
    const room = await findRoom(id,true)
    socket.emit('server-response-fetsh-messages',{messages:room.messages})
  })
  socket.on('start-a-new-poll', async ({eventid,question,options:options}) => {
    let success=false
    let options_id = []
    console.log('heeey');
    try {
      let opt

      const poll = await polls.create({event:eventid,question:question,creator:socket.user._id,options:[]})

      const pollcopy = JSON.parse(JSON.stringify(poll));
      console.log(pollcopy);
      for(const option of options){
        opt = await optionsDB.create({text:option})
        options_id.push(opt._id)
        poll.options.push(opt._id)
        pollcopy.options.push(opt)


        console.log('poll',poll,options_id);

      }
      // log.info('poll',poll)
      console.log('--------------------poll',poll);
      await poll.save()
      success = true
      // socket.broadcast.to(eventid).emit('poll-creation', {success,poll});
      console.log('pollcopy',pollcopy);
      io.sockets.in(eventid).emit('poll-creation', {success,poll:pollcopy});


    } catch (e) {
      success = false
      console.log(e.message);
      io.sockets.in(eventid).emit('poll-creation', {success});

      // socket.broadcast.to(eventid).emit('poll-creation', {success});
    }



  })
  socket.on('user-vote',async ({eventid,optionid,pollid})=>{
    const user = socket.user;
    try{
      const opt = await optionsDB.findOne({_id:optionid});
      opt.votes =opt.votes+1;
      opt.save();
      const poll = await polls.findOne({_id:pollid}).populate('options');
      io.sockets.in(eventid).emit('user-vote-success',{poll})
    }catch (e) {
      console.log(e.message);
      io.sockets.in(eventid).emit('error-vote')
    }
  })


}
export default sockethandler
