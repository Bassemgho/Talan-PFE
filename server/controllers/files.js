import files from '../models/file.js'
import messages from '../models/message.js'
export const uploadfile = async (req,res,next)=>{
  try{
    console.log('receiving file')
    const file  = req.file
    const {eventid} = req.params
    const user = req.user;
    const f = await files.create({uploader:user._id,path:file.path,size:file.size})
    return res.status(200).json({success:true,message:'file uploaded successfully'})

  }catch(e){
    next(e)
  }
}
