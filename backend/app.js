import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import {errorHandler} from "./src/middleware/errorHandler.middleware.js"

import dotenv from "dotenv"
dotenv.config({path:'./.env'})

export const app=express()
 
app.use(cors({
    origin:[process.env.FRONTEND_URL,'https://secrets-chat.vercel.app',"http://localhost:5173"],
    methods:["GET", "POST", "DELETE", "PUT"],
    credentials:true,
    allowedHeaders: ["Content-Type", "Authorization"] 
}))

app.options('*',cors())


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))


// Middleware function to add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL); // Update this with your frontend URL
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });


app.get('/',(req,res)=>{
    res.status(200)
       .json({
        message :"Server is running here ..."
       })
       
})


import userRouter from "./src/routes/userRouters.js"


app.use('/api/v1/user',userRouter)

app.use(errorHandler)
export default app;