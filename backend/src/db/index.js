import mongoose from 'mongoose'


export const connectDB=async()=>{
try {
    const connectionInstance= await mongoose.connect(process.env.MONGODB_URI);

    console.log(`database connect !  connection host :${connectionInstance.connection.host}`)

} catch (error) {
    console.log(`DataBase connection Failed ! `,error)
                      
    process.exit(1);
}
}