import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

import {errorHandler} from "./src/middleware/errorHandler.middleware.js"

import dotenv from "dotenv"
dotenv.config({path:'./.env'})

const app=express()
 
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