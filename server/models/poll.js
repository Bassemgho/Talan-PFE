import mongoose from 'mongoose' ;
import options from './option.js'

const pollSchema = mongoose.Schema({
  event:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'events',

  },
  creator:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'users',
  },
  options:{
    type:[mongoose.Schema.Types.ObjectId],
    ref:'options'
  },
  question:{
    type:'String'
  }

},{timestamps:true})

const polls = mongoose.model('polls',pollSchema)
export default polls;
