import dotenv from "dotenv"
dotenv.config({ path: './.env' })

import { connectDB } from "./src/db/index.js"
// import server from "./socket.js"
// import { app } from "./socket.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import express from "express"
import { errorHandler } from "./src/middleware/errorHandler.middleware.js"


import mongoose from "mongoose"
import http from "http"
import {Server} from "socket.io"
// import express from "express"
import {User} from './src/modles/user.model.js'
import {Conversation} from "./src/modles/conversation.model.js"
import {Message} from './src/modles/message.model.js'



import { getConversation } from "./src/helper/getConversation.js"

export const app=express()

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
   'https://secrets-chat.vercel.app'

];

// CORS middleware for HTTP requests
app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.setHeader('Access-Control-Allow-Origin', origin);
//   }
//   res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.header('Access-Control-Allow-Credentials', 'true');
//   next();
// });



app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.status(200)
    .json({
      message: "Server is running here ..."
    })

})


import userRouter from "./src/routes/userRouters.js"


app.use('/api/v1/user', userRouter)

app.use(errorHandler)

const server=http.createServer(app);
  

// console.log("env inside socket" ,process.env.FRONTEND_URL)
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});



// socket running at "http://localhost:8000/"

  const onlineUsers=new Set();


io.on('connection', async (socket) => {
    console.log("User connected", socket.id);
    //  console.log(socket)
    const userId = socket.handshake.auth.userId;
    if (!userId) {
        return;
    }
      
    const userRoom = userId.toString();

    socket.join(userRoom);
    onlineUsers.add(userRoom);
 
    io.emit('onlineUser', Array.from(onlineUsers));

    // Handle chat-page event
    socket.on('chat-page', async (user2Id) => {
        try {
            if (!mongoose.Types.ObjectId.isValid(user2Id)) {
                throw new Error('Invalid user2Id');
            }
            
            const user2 = await User.findById(user2Id).select("-password");
            if (!user2) {
                throw new Error('User not found');
            }
            
            const userDetails = {
                _id : user2?._id,
                name : user2?.name,
                email : user2?.email,
                profile_pic : user2?.profile_pic,
                online : onlineUsers.has(user2Id)
            }
            
            socket.emit('userDetail', userDetails);

            const conversation = await Conversation.findOne({
                "$or": [
                    { sender: userId, receiver: user2._id },
                    { sender: user2._id, receiver: userId }
                ]
            }).populate("messages").sort({ updatedAt: -1 });

            socket.emit('message', conversation?.messages || []);
        } catch (error) {
            console.error('Error in chat-page event:', error);
            socket.emit('error', 'Error fetching chat details');
        }
    });

    // Handle new-message event
    socket.on('new-message', async (msg_obj) => {
        try {
            if (!msg_obj || !msg_obj.sender || !msg_obj.receiver) {
                throw new Error('Invalid message object');
            }
            const user1Id = msg_obj.sender;
            const user2Id = msg_obj.receiver;

            let conversation = await Conversation.findOne({
                "$or": [
                    { sender: user1Id, receiver: user2Id },
                    { sender: user2Id, receiver: user1Id }
                ]
            });

            if (!conversation) {
                conversation = await Conversation.create({
                    sender: user1Id,
                    receiver: user2Id,
                    messages: []
                });
            }

            const message = await Message.create(msg_obj);
            conversation.messages.push(message._id);
            await conversation.save();

            conversation = await Conversation.findOne({
                "$or": [
                    { sender: user1Id, receiver: user2Id },
                    { sender: user2Id, receiver: user1Id }
                ]
            }).populate("messages").sort({ updatedAt: -1 });

            io.to(userRoom).emit('message', conversation?.messages || []);
            const receiverRoom = user2Id.toString();
            io.to(receiverRoom).emit('message', conversation?.messages || []);

            const senderConversation = await getConversation(user1Id);
            const receiverConversation = await getConversation(user2Id);

            io.to(userRoom).emit('conversation', senderConversation || []);
            io.to(receiverRoom).emit('conversation', receiverConversation || []);
        } catch (error) {
            console.error('Error in new-message event:', error);
            socket.emit('error', 'Error sending message');
        }
    });

    // Handle side-bar event
    socket.on("side-bar", async (currentUserId) => {
        try {
            const senderConversation = await getConversation(currentUserId);
            console.log("sender conversation at server (side-bar) ",senderConversation)
            socket.emit("conversation", senderConversation);
        } catch (error) {
            console.error('Error in side-bar event:', error);
            socket.emit('error', 'Error fetching conversation');
        }
    });

    // Handle seen event
    socket.on("seen", async (msgByUserId) => {
        try {
            const conversation = await Conversation.findOne({
                "$or": [
                    { sender: userId, receiver: msgByUserId },
                    { sender: msgByUserId, receiver: userId }
                ]
            });

            if (!conversation) {
                return ;
            }

            const allMessageId = conversation.messages || [];
            await Message.updateMany({
                _id: { $in: allMessageId },
                msgByUserId: msgByUserId
            },{
                seen: true
            });

            const senderConversation = await getConversation(userId);
            const receiverConversation = await getConversation(msgByUserId);

            io.to(userRoom).emit('conversation', senderConversation || []);
            const receiverRoom = msgByUserId.toString();
            io.to(receiverRoom).emit('conversation', receiverConversation || []);
        } catch (error) {
            console.error('Error in seen event:', error);
            socket.emit('error', 'Error updating message seen status');
        }
    });

    // Handle disconnect event
    socket.on('disconnect', () => {
        onlineUsers.delete(userId?.toString());
        console.log("User disconnected:", socket.id);
    });
});


  export default server;
  



connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8080, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
  })
  .catch((err) => {
    console.log(`mongoDB connection failed !`, err)
  })



