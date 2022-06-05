import errorResponse from "../utils/errorResponse.js";
const errorHandler = (err,req,res,next) => { 
    let error = {...err}
    error.message = err.message;
    if(err.code==11000){
        const message = "Duplicate key values";
        error = new errorResponse(message,404);
        console.log("Duplicate key values")

    }
    if(err.name === "ValidationError"){
        const message = Object.values(err.errors).map((val) => { val.message })
        error = new errorResponse(message,404);
        console.log("ValidationError")

    }
    console.log(err.message)
    res.status(error.cod).json({success:false,message:err.message||"server error"})

 }
 export default errorHandler;