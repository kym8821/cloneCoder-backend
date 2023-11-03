import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import userRoute from './route/user'
import googleLoginRoute from './route/googleLogin'
import localLoginRoute from './route/localLogin'
import session from '../config/session'
import path from 'path';
dotenv.config()

const app = express()

app.use(session)
app.use("/user", userRoute)
app.use("/google", googleLoginRoute)
app.use("/local", localLoginRoute)

app.get("/", (req:any, res:Response)=>{
  console.log(req.session)
  res.sendFile(path.resolve("views/index.html"));
});

const port = "3000"
app.listen(port, ()=>{
  console.log(`http://localhost:${port}`)
})