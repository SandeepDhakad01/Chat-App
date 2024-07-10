import { User } from "../modles/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

export const checkEmail= asyncHandler(async(req,res,next)=>{
    //  console.log("check Email controller is called...")
    //  console.log("req.query =>",req.query)
    const {email}=req.query

    if(!email)
        return next(new ApiError(400,"please provide email"))

    try{
    const user=await User.findOne({email}).select("-password")

   if(!user) 
     return next(new ApiError(404,"User Not Found"))

   res.status(200)
   .json(new ApiResponse(200,user,"email verified"))
    }
    catch(err){
        return next(new ApiError(500,"problem in verifing the user:",err))
    }

})