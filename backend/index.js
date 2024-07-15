import dotenv from "dotenv"
dotenv.config({ path: './.env' })

import { connectDB } from "./src/db/index.js"
import server from "./socket.js"

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8080, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
  })
  .catch((err) => {
    console.log(`mongoDB connection failed !`, err)
  })



