import mongoose from 'mongoose'
import messages from './message.js'
const roomSchema = mongoose.Schema({
  event:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'events'
  },
  messages:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:'messages',
    select:false,

  },
  files:{
    type:['String'],
  }

})
roomSchema.methods.addMessage = async function (message) {
  let msg
  try {
     msg = await messages.create({sender:message.sender,text:message.msg})
    this.messages.push(msg._id)
    console.log(msg);
    await this.save()
  } catch (e) {
    console.log('error: ',e.message);
  }
  return msg;
}
const rooms = mongoose.model('rooms',roomSchema);
export default rooms
