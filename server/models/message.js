import mongoose from 'mongoose'

const messageSchema  = mongoose.Schema({
  room:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'rooms'

  },
  sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'users',
    required:[true,'please provide a sender']
  },
  text:{
    type:'String',
    required:[true,'please provide a text message']

  },
  attachement:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'files'
  }

},{timestamps:true})

const messages = mongoose.model('messages',messageSchema)
export default messages;
