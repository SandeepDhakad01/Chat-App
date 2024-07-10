import { Conversation } from "../modles/conversation.model.js"

export const getConversation=async(currentUser)=>{
      if(currentUser){
      const allConversations=await Conversation.find(
            {
                  "$or":[
                       {sender:currentUser},
                       {receiver:currentUser}
                     ]
            }
      ).sort({updateAt:-1}).populate("messages").populate("sender").populate("receiver")

      const conversation=allConversations.map((conv)=>{
              const unseen=conv?.messages?.reduce((prev,msg)=>{
                  const msgByUserId=msg.msgByUserId.toString();
                  if(msgByUserId !== currentUser && msg.seen==false){
                        return prev+1;
                    }
                    else{
                        return prev
                    }
              },0)

            return {
                  _id:conv?._id,
                  sender:conv?.sender,
                  receiver:conv?.receiver,
                  unseenMsg:unseen,
                  lastMsg:conv?.messages?.[conv?.messages?.length - 1]
            }
      })

      return conversation;
      }
      else 
      return []
}

  