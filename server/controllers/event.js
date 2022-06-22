import events from "../models/event.js";
import users from "../models/user.js"
import errorResponse from '../utils/errorResponse.js'
// import transport from "../utils/transport.js";
// import transport from "../utils/transport.js";
import {sendMail} from '../utils/transport.js'

export const fetshuserevents = async (req,res,next)=>{
    const id=req.user._id;
    try{
	const evts = await events.find({$or:[{participants:id},{mods:id}]}).populate('participants').populate('mods')
	if(evts){
    let ev
    const evt2 = evts.map((event,id)=>{
      ev={};
      ev.id=id
      ev.allDay=false
      ev.type=1;
      ev.description=event.desc||''
      ev.end=event.dateFin
      ev.start=event.dateDebut
      ev.title=event.titre
      ev.participants = event.participants
      ev.mods = event.mods
      ev._id = event._id
      return  ev;
    })
    return res.status(201).json({success:true,events:evt2})
      // console.log('event',evts);
	    // return res.status(201).json({success:true,events:evts})
	}
    }catch(error){
	    return (next(error))

}
}
export const fetshallevents = async (req,res,next) => {
  if (req.user.role.titre =='admin') {

    try {
      let ev
      const evts  = await events.find({})
      if(evts){
        const evt2 = evts.map((event,id)=>{
          ev={};
          ev.id=id
          ev.allDay=false
          ev.type=1;
          ev.description=event.desc||''
          ev.end=event.dateFin
          ev.start=event.dateDebut
          ev.title=event.titre
          ev.participants = event.participants
          ev.mods = event.mods
          ev._id = event._id
          return  ev;
        })
        return res.status(201).json({success:true,events:evt2})
      }
    } catch (error) {
      next(error)
    }
  }else {
    fetshuserevents(req,res,next)
  }
 }
export const updateEvent = async (req,res,next) => {
  const {eventId,update} = req.body
  try {
    const ev = await events.findOneAndUpdate({_id:eventId},update, { returnDocument: 'after' })
    res.status(201).json({success:true,event:ev})
  } catch (e) {

  }
}
export const addEvent = async (req, res, next) => {
  console.log('body',req.body)
    let {titre,participants,mods,dateDebut,dateFin,desc} = req.body
    try {
        console.log(titre,participants,mods,dateDebut,dateFin)
        if(!titre||!participants||!mods||!dateDebut||!dateFin||!desc){
            return next(new errorResponse('validation error',400))
        }
        dateDebut = new Date(dateDebut)
        dateFin = new Date(dateFin)
        const usrs = await users.find({email:{$in:participants}},{_id:1})
        usrs.map((val,ind) => {
          console.log('val,',val);
            usrs[ind]  = val._id
         })
        console.log('users,',usrs)
        const event = await events.create({titre,participants:usrs,mods:usrs,dateDebut,dateFin,desc})
        const evts = await events.find({})

        // send emails to participants and mods
        const data = {
            to: participants,
            // from: email,
            // template: 'forgot-password-email',
            subject: 'you are invited to an event!',
            html:  `<p>Hello </strong><span style="text-transform:uppercase">${req.user.firstname}</span><strong></strong>, <p/>
                <p>link will be provided soon <br/>
                <ul>
                <li>Event title : \n<b>${event.titre} </li> <br/>
                <li>Event date : \n<b>${event.dateDebut} </li> <br/>
                <li>Event dateF : \n<b>${event.dateFin} </li> <br/>

                </ul>
                Best regards.
                </p>`
        }
        sendMail(data,next)

        return res.status(200).json({success:true,message:usrs,event})

    } catch (error) {
        next(error)
    }

}
export const deleteEvent = async (req, res, next) => {
    const {id} = req.body
    console.log(id)
    try {
        const event = await events.findOneAndDelete({_id:id}).populate('participants')
        if(event){
          console.log(event)
            // send emails to participants and mods
        const data = {
            to: event.participants,
            // from: email,

            subject: 'an event is deleted!',
            html:  `<p>Hello </strong><span style="text-transform:uppercase">${req.user.firstname}</span><strong></strong>, <p/>
                <p>you are invited to the event : ${event.title} <br/>
                <ul>
                <li>the event has been cancelled : \n<b>${req.body.email} </li> <br/>

                </ul>
                Best regards.
                </p>`
        }
        sendMail(data,next)
        const all = await events.find({})
console.log('its here');
            return res.status(201).json({success:true,message:"the event has been successfulyy removed",all})
        }
        res.status(404).json({success:false,message:"there is no event "})
    } catch (error) {
        next(error)
    }
}
export const modifyEvent = (req, res, next) => {

}
