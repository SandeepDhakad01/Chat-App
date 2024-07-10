import { ApiError } from "../utils/ApiError.js"


export const errorHandler=(err,req,res,next)=>{
     
    // console.log("inside global error handler -> ")
    // console.log(err.stack)
    
    return res.status(err.status || 500)
    // .json(new ApiError(err.status||500,err.message||"Internal Server Error..."))   // yeh kam nhi kar raha  pata nhi kyu ....
    .json({
        status:err.status||500,
        message:err.message||"Internal Server Error...",
        success:false,

    })
}