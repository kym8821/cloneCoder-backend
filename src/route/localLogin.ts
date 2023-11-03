import express from 'express'

const route = express.Router()

route.post('/login', (req, res)=>{
  const data = req.query
  console.log(data)
  res.send("data get")
});

export default route;