import { User } from "../modles/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import  jwt  from "jsonwebtoken";



export const isAuthorized=asyncHandler(async(req,res,next)=>{
   try {
   
     const {token}=req.cookies

// console.log("inside the auth middleware token=>",token)

    if(!token)
        return next(new ApiError(400,"user is not authorized "))

     const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);

     const user=await User.findById(decoded.id).select("-password");

     if(!user)
        return next(new ApiError(400,"Invalid token"))

   
     req.body.user=user;
  

        next();
      } catch (err) {
         next(err)
      }
})