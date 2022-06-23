import mongoose from "mongoose";
import users from './user.js'
import rooms from './room.js'
const eventSchema = mongoose.Schema({
    titre:{
        type:"String",
        required:[true,'please insert event title']

    },
    room:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'rooms'
    },
    dateDebut:{
        type:Date,
        required:[true,'please add event date']
    },
    dateFin:{
        type:Date,
        required:[true,'please add event date']
    },
    participants:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        }
    ],
    mods:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'users'
        }
    ],
    createdby:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'users'
    }
    //to add votes in the future
    //to add messages
    //to addfeetback in future
})
// eventSchema.pre('save',async function (next){
//     if(this.isModified('participants')){
//         const l = []
//         this.participants.map((val,index) => {
//             users.findOne
//          })
//     }
// })
eventSchema.post('save',async function (doc,next){
  try {
    const room = await rooms.create({event:doc._id})
    console.log(room);
    this.room = room._id
    next()
  } catch (e) {
    next(e)
  }

})
const events = mongoose.model('events',eventSchema)
export default events;
