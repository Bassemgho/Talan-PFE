import chats from '../models/chat.js'
export const getChat = async (req,res,next) => {
  try {
    const chat= await chats.findOne({_id:req.params.id})
    return res.status(201).json({success:true,chats:chatts})
  } catch (e) {
    return next(e)
  }

}

export const getChats = async (req,res,next) => {
  try {
    const chatts = await chats.find({participants:req.user._id}).populate('participants')
    return res.status(201).json({success:true,chats:chatts})
  } catch (e) {
    return next(e)
  }

}
export const createChat =async (req,res,next)=>{
  const {participants} = req.body;
  participants.push(req.user)
  try {
    const chat = await chats.create({participants})
    await chat.populate('participants')
    return res.status(201).json({success:true,chat})
  } catch (e) {
    return next(e);
  } finally {

  }
}
