import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"
import dotenv from "dotenv"

const app = express()

dotenv.config({
    path:'./.env'
})


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
  }))



export {app}