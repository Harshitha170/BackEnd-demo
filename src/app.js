import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()


app.use(cors({
    origin: process.env.CORS_Origin
}))


app.use(express.json({limit: "16kb"}))

app.use(express.urlencoded({extended: true, limit: "16kb"}))


app.use(express.static('public'))  // to store images, files

app.use(cookieParser())
export { app }