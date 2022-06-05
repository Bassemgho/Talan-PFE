import messages from '../models/message.js'
import rooms from '../models/room.js'

export const fetsh_event_message = async (req,res,next) => {
  const {id} = req.body
  try {
    const {messages} = await rooms.findOne({_id:id}).populate('messages')
     return res.status(204).json({success:true,messages})
  } catch (e) {
    next(e)
  }
} 
