import mongoose from 'mongoose'

const fileSchema = mongoose.Schema({
  ext:{
    type:'String',
    required:[true,'cant find extension']
  },
  path:{
    type:'String',
    required:[true,"cant find the path to the file"]
  }
},{timestamps:true})
const files = mongoose.model('files',fileSchema);
export default files;
