import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const userSchema =new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"provide name"],
            trim:true
        },
        email:{
            type:String,
            required:[true,"provide email"],
            unique:[true,"email already exist"],
            trim:true,
            lowercase:true
        },
        password:{
            type:String,
            required:[true,"please provide password"]
        },
        profile_pic:{
            type:String,
            default:""
        }

    },
    {timestamps:true}
)

userSchema.pre('save',async function(next){
    if(!this.isModified("password")) return next();

    try {
        this.password=await bcrypt.hash(this.password,10);
        next();
    } catch (err) {
        next(err)
    }
}) 

userSchema.methods.isPasswordCorrect=async function(password){
    const isCorrect= await bcrypt.compare(password,this.password)
    return isCorrect;
}


userSchema.methods.generateToken=function(){
    const payload={
        id:this._id,
        name: this.name,
        email:this.email
    }

    const token= jwt.sign(payload,process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_TOKEN_EXPIRY
    })

    return token;
}

export const User=mongoose.model('User',userSchema)

