import mongoose from "mongoose"

const conversationSchema=new mongoose.Schema(
    {
        sender:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:true
        },
        receiver:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:true

        },
        messages:[
            {
            type:mongoose.Schema.ObjectId,
            ref:'Message',
            default:[]
           }
                ]
    },
    {timestamps:true}
)


export const Conversation=mongoose.model('Conversation',conversationSchema);