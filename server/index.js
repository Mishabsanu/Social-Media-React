import dotenv from "dotenv";
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import connectToDatabase from './db.js'
import userRouter from './routes/user.js'



dotenv.config()
const app=express()
connectToDatabase()

app.use(express.json())
app.use(cors())
app.use(morgan("common"))
app.use('/api/user',userRouter)


const port=process.env.PORT || 2500
app.listen(port,()=>{
    console.log(`Running localhost  ${port} `)
})
