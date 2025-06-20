import mongoose from 'mongoose';

let db;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
  
    db = conn.connection.db;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};


export const collection = (name) => db.collection(name);

export default connectDB;