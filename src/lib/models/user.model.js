import { timeStamp } from "console";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(

    
        { 
            clekId:{
                type: stringify,
                required:true,
                unique:true,
            },
            email:{
                type:stringify,
                required:true,
                unique: true,
            },
            firstName:{
                type:string,
                required:true,
            },
            lastName:{
                type:string,
                required:true,
            },
            profilePicture:{
                type:string,
                required:true,
            }

        },{
            timeStamp:true,
        }


    
);
const User =mongoose.model.User || mongoose.model('User', userSearch);
export default User;