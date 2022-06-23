import files from '../models/file.js'
import messages from '../models/message.js'
import events from '../models/event.js'
import rooms from '../models/room.js'
export getmyfiles = async (req,res,next)=> {
  const {user} = req.user;
  const id = user._id
  // look for rooms;
  try {
    const evts = await events.find({$or:[{participants:id},{mods:id}]}).populate('participants').populate('mods')
    const listevents = evts.map((event)=>{
      return event._id
    })
    const roms = await rooms.find({_id:{$in:listevents}}).populate('files')
    return res.status(201).json({success:true, rooms:roms})



  }catch(err){
    return(next(err))
  }
}
export const getFile = async (req,res,next)=>{
  try{
    const {fileid} = req.params
    // const user = req.user
    const file = await files.findOne({_id: fileid}).populate('uploader')
    return res.status(200).json({success:true,name:file.name,updatedAt:file.updatedAt,uploader:`${file.uploader.firstname} ${file.uploader.lastname}`})

  }catch(err){
    next(err);
  }
}
export const uploadfile = async (req,res,next)=>{
  try{
    console.log('receiving file')
    const file  = req.file
    const {eventid} = req.params
    const user = req.user;
    const f = await files.create({uploader:user._id,path:file.path,size:file.size,name:file.filename})
    f.attachToEvent(eventid)
    return res.status(200).json({success:true,message:'file uploaded successfully',file:f})

  }catch(e){
    next(e)
  }
}
