import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import userRoute from './route/user'
import googleLoginRoute from './route/googleLogin'
import localAccountRoute from './route/localAccount/localAccount'
import folderRoute from "./route/folderStructure/folderStructure"
import session from '../config/session'
import path from 'path';
import events from 'events';
dotenv.config()

const app = express()
const EventEmitter = new events.EventEmitter();
EventEmitter.setMaxListeners(50);

app.use(session)
app.use("/user", userRoute)
app.use("/google", googleLoginRoute)
app.use("/local", localAccountRoute)
app.use("/folder", folderRoute)

app.get("/", (req:any, res:Response)=>{
  res.send("Hello World");
});

const port = "3000"
app.listen(port, ()=>{
  console.log(`http://localhost:${port}`)
})