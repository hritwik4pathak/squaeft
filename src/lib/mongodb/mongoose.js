import mongoose from "mongoose";
let initialized = false;

export const connect =async ()=>{
    mongoose.set('strictQuery', true);

    if (initialized){
        console.log('MongoDB already connected');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI,{
            dbName:'SqFt-Estate-1',
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        initialized =true;
        console.log('MongoDb connected');
        } catch(error){
            console.log('MongoDB connection error:', error);

        }
    }
