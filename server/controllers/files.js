import files from '../models/file.js'
import messages from '../models/message.js'
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
