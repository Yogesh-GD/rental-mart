import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import  jwt from "jsonwebtoken";

const adminSchema = new Schema(
    {
        userName:{
            type:String,
            unique:true,
            required:true,
            trim:true,
        },
        email:{
            type:String,
            unique:true,
            required:true,
            trim:true,
        },
        password:{
            type:String,
            unique:true,
            required:true,
            trim:true,
            select:false
        },
        refreshToken:{
            type:String,
            select:false
        }
    },
    {
        timestamps:true
    }
)


adminSchema.pre("save", async function(next){
    if (!this.isModified("password")) {
        return next();
      }
    this.password= await bcrypt.hash(this.password,10)
    next()
})

adminSchema.methods.isPasswordCorrect= async function (password){
    return await bcrypt.compare(password,this.password)
}


adminSchema.methods.generateAccessToken = async function(){
    return jwt.sign( 
        {
            _id : this._id
        },
        process.env.ADMIN_ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ADMIN_ACCESS_TOKEN_EXPIRY
        }
    )
}
 
adminSchema.methods.generateRefreshToken  = async function() {
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.ADMIN_REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.ADMIN_REFRESH_TOKEN_EXPIRY
        }
    )
}


export const Admin = mongoose.model("Admin", adminSchema)