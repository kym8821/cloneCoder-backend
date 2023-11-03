import express, { Request, Response } from 'express';

const route = express.Router()
route.get('/', (req:Request, res:Response)=>{
  res.send("user")
})
route.get('/asdf',(req,res)=>{
  res.send('asdf')
})

export default route