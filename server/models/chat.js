import mongoose from 'mongoose'

const chatSchema = mongoose.Schema({
  participants:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:'users',
    required:[true,'please provide participants']
  },
  messages:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:'users',
    default:[]
  }
})
const chats = mongoose.model("chats",chatSchema);
export default chats;
