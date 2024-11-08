import mongoose from "mongoose";
import colors from "colors"

const ConnectDB = async() => {
   try{
       const conn =  await mongoose.connect(process.env.MONGO_URL)
       console.log(`Connected to MongoDB ${conn.connection.host}`.bgMagenta.white)
   }catch(err){
      console.log(`error in MongpDb ${err}`.bgRed.white)
   }
}

export default ConnectDB