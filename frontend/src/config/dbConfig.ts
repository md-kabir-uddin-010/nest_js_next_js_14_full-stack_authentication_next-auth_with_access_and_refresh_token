import mongoose from "mongoose";

const dbConfig = async (): Promise<any> => {
  try {
    await mongoose.connect(process.env.DTABASE_URL as string, {
      dbName: process.env.DTABASE_NAME as string,
    });
  } catch (error) {
    console.log("Database connection error ");
  }
};

export default dbConfig;
