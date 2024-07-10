import dotenv from "dotenv"

dotenv.config({path:'./.env'})

import {connectDB} from  "./src/db/index.js"

import  server  from "./socket.js"
 import { app } from "./socket.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import express from "express"
import {errorHandler} from "./src/middleware/errorHandler.middleware.js"


app.use(cors({
  origin:[process.env.FRONTEND_URL,'https://secrets-chat.vercel.app',"http://localhost:5173"],
  methods:["GET", "POST", "DELETE", "PUT"],
  credentials:true,
  allowedHeaders: ["Content-Type", "Authorization"] 
}))



app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))

app.get('/',(req,res)=>{
  res.status(200)
     .json({
      message :"Server is running here ..."
     })
     
})


import userRouter from "./src/routes/userRouters.js"


app.use('/api/v1/user',userRouter)

app.use(errorHandler)



connectDB()
          .then(()=>{
                server.listen(process.env.PORT || 8080,()=>{
                    console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
                })
          })
          .catch((err)=>{
            console.log(`mongoDB connection failed !`,err)
          })



          