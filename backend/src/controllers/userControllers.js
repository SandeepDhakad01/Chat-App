import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

import { User } from "../modles/user.model.js"


export const register=asyncHandler(async(req,res,next)=>{
  
      const {name,email,password,profile_pic}=req.body

      if(!name && !email && !password)
        return next(new ApiError(400,"please provide all details"))
    try{
       const userExist=await User.findOne({email})

       if(userExist)
        return next(new ApiError(400,"email already exist"))
    

    const newuser= await User.create(
        {
          name,
          email,
          password,
          profile_pic
        }
       )

       const user=await User.findById(newuser._id).select("-password")
         
      const token= user.generateToken();

     const options={
        expires:new Date(Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000),
        httpOnly:true,
        secure:true,
        samesite:true
     }

     return res.status(201)
         .json(new ApiResponse(201,user,"User registered successfully🤗"))
         .cookie('token',token,options) 
}
catch(err){
  return next(new ApiError(500,"error in registering user...",err))
}
})


export const getUserDetails=asyncHandler((req,res,next)=>{
 
     try { 
           const {user}=req.body
           res.status(200)
           .json(new ApiResponse(200,user,"current user fetched successfully"))
           
     } catch (err) {
        next(new ApiError(400,'user not fetched ...'))
     }
})


export const logout=asyncHandler(async(req,res,next)=>{
   try {
      console.log("req.body=>",req.body)
    const {user}=req.body
       
    const options={
      expires:new Date(Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000),
      httpOnly:true,
      secure:true,
      samesite:true
   }
      res.cookie('token','',options)
       res.status(200)
          .json(200,user,"user logout successfully")
        
   } catch (err) {
      console.log("logout controller me error error aa gya ...")
    return next(new ApiError(500,err.message||err))
   }
})



export const updateUserDetails=asyncHandler(async(req,res,next)=>{
  try {
     const {user,name,profile_pic}=req.body
     
     console.log("inside update controller")
     // yaha per validation chalna ha h ki nahi socho ....

     const updatedUser=await User.findByIdAndUpdate(user._id,{
      name,
      profile_pic
     },
    {
      new:true,
      runValidators:true
    })

     updatedUser.password=undefined;

     res.status(200)
     .json(new ApiResponse(200,updatedUser,"user updated  Successfully"))

  } catch (err) {
     return next(new ApiError(500,err.message || err))
  }
})


export const searchUsers=asyncHandler(async(req,res,next)=>{
         try {
            const {search}= req.query;
     
             const query = new RegExp(search,"i","g")
     
             const users = await User.find({
                 "$or" : [
                     { name : query },
                     { email : query }
                 ]
             }).select("-password")
     
             return res.status(201)
                       .json(new ApiResponse(201,users,"all users find successfully"))  
         } catch (err) {
             return next(new ApiError(500,"error in searching users:",err))
         }
     })