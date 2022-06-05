import polls from '../models/poll.js'

export const getallpolls = async (req,res,next) => {
  try {
    const {id} = req.body
    const allpolls = await polls.find({room:id}).populate('options')
    return res.status(200).json({success:true,all:allpolls})

  } catch (e) {
    console.log(e.message);
    next(e)
  }
}
