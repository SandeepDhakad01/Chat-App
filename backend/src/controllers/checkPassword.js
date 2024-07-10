import { User } from "../modles/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";



export const checkPassword=asyncHandler(async(req,res,next)=>{
    try {
        
        const {password,userId}=req.query
 
         if(!password || !userId)
            return next(new ApiError(400,"please provide password or userId"))
        const user=await User.findById(userId)

        if(!user)
            return next(new ApiError(404,"no such user exist"))


        const verifyPassword= await user.isPasswordCorrect(password)

        if(!verifyPassword)
            return next(new ApiError(400,"please check password"))

        const token = user.generateToken();

        const cookie_options={
            expires:new Date(Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000),
            httpOnly:true,
            secure:true,
            sameSite:'None'
            
         }
         
         res.cookie('token',token,cookie_options)

        user.password=undefined
        res.status(200)
           .json(new ApiResponse(200,user,"user login successfully"))
            

    } catch (err) {
        return next(err)
    }
})