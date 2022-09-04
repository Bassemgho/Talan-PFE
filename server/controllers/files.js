import files from '../models/file.js'
import messages from '../models/message.js'
import events from '../models/event.js'
import rooms from '../models/room.js'
import express from 'express'
export const downloadFile = async (req,res,next) => {
  const user = req.user;
  const id = user._id
  const {file_id} = req.params
  try {
    const file = await files.findOne({_id:file_id})
    console.log(file.path);
    return res.status(201).download(file.path.toString())
  } catch (e) {
    return next(e)
  }
}
export const getmyfiles = async (req,res,next)=> {
  const user = req.user;
  console.log(user);
  const id = user._id
  // look for rooms;
  // if(user.role.titre ==='admin'){
  //   try {
  //     const roms = await rooms.find({})
  //   }catch(err){
  //     return next(err);
  //   }
  // }else{
  //
  // }
  try {
    const evts = await events.find({$or:[{participants:id},{mods:id}]}).populate('participants').populate('mods')
    const listevents = evts.map((event)=>{
      return event._id
    })
    const roms = await rooms.find({event:{$in:listevents}}).populate('event')
    console.log('events',listevents);
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
