import users from "../models/user.js"
import errorResponse from "../utils/errorResponse.js"
import jwt from "jsonwebtoken"

const protectAdmin = async (req,res,next) => { 
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
        // console.log(token)
    }
    if(!token){
        return next(new errorResponse("no token was found",401))
    }
    try {
        const decoded = jwt.verify(token,"secretcode");
        // trying to find the user with decoded id
        const user = await users.findOne({_id:decoded.id}).populate('role')
        // console.log(user)
        if(!user){
            console.log("no user was found")
            return next(new errorResponse("no usr was found",404))
        }
        if(user.role.titre!='admin'){
            return next(new errorResponse("not authorized",401))
        }
        // attach user to req
        req.user = user
        next()
    } catch (error) {
        return (next(new errorResponse("not authorized on this route",401)))
    }
 }
 export default protectAdmin;