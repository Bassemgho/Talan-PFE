import users from "../models/user.js"
import errorResponse from "../utils/errorResponse.js"
import jwt from "jsonwebtoken"

const protectsocket = async (socket, next) => {
  // console.log('hereeee');
  if (socket.handshake.query && socket.handshake.query.token){
    // console.log( "hereeee");
    try {
      const decoded = jwt.verify(socket.handshake.query.token, 'secretcode');
      const user = await users.findOne({_id:decoded.id})
      if(!user){
          console.log("no user was found")
          return next(new Error("no usr was found"))
      }
      console.log('before next');
      socket.user = user
      next()


    } catch (e) {
      console.log(e.message);
      return next(new Error('someting went wrong'));

    }

  }
  else {
    next(new Error('no auth token'));
  }

}
export default protectsocket
