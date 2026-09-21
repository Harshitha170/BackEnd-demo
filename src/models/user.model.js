import mongoose, {Schema} from'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'



const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
         email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
         fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, //cloudinary
            required: true
        },
        coverImage: {
            type: String
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'password is required']
        },
        refreshToken: {
            type: String
        }
    },
        {
            timestamps: true
        }
    
)
//password encrypt
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password, 10);
})
//custom methods
userSchema.methods.isPasswordCorrect = async function(password){
        return await bcrypt.compare(password, this.password)

}
//short duration
userSchema.methods.generateAccessToken = function(){
  return  jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}




//long duration, get stored in db and with user also. no need to enter password again nd again
userSchema.methods.generateRefreshToken = function(){
    return  jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)