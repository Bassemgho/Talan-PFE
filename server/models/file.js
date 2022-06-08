import mongoose from 'mongoose'

const fileSchema = mongoose.Schema({
  uploader:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'users'
  },
  ext:{
    type:'String',
    required:[true,'cant find extension']
  },
  path:{
    type:'String',
    required:[true,"cant find the path to the file"]
  },
  size:{
    type:'Number'
  }
},{timestamps:true})
const files = mongoose.model('files',fileSchema);
export default files;
