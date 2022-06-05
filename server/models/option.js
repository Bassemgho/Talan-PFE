import mongoose from 'mongoose'

const optionSchema = mongoose.Schema({
  text:{
    type:'String',

  },
  votes:{
    type:'Number',
    default:0
  },
  voters:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:'users',
    default:[]
  }
})
const options = mongoose.model('options',optionSchema);
export default options;
