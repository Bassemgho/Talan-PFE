import mongoose from 'mongoose'
import rooms from './room.js'
const fileSchema = mongoose.Schema({
  uploader:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'users'
  },
  name:{
    type:"String",
    required:[true,"cant find the name to the file"]

  },
  ext:{
    type:'String',
  },
  path:{
    type:'String',
    required:[true,"cant find the path to the file"]
  },
  size:{
    type:'Number'
  }
},{timestamps:true})
fileSchema.methods.attachToEvent = async function (eventId) {
  try {
    const room = await rooms.findOne({event:eventId});
    room.files.push(this._id);
    room.save();

  } catch (e) {

  } finally {

  }
}
const files = mongoose.model('files',fileSchema);
export default files;
