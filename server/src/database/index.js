import mongoose from "mongoose";
import {database_name} from "../utils/constants.js"

const database_uri = process.env.DATABASE_URI 


const connectDB = async () => {
    try {
        const db_res = mongoose.connect(`${database_uri}${database_name}`)
    } catch (error) {
        return new Error(error?.message || "Db Error")
    }
}

export default connectDB