import express from 'express';
import localLoginRoute from "./localLogin";
import localSigninRoute from "./localSignin";

const route = express.Router();
route.use("/login", localLoginRoute);
route.use("/signin", localSigninRoute);

route.post("/logout", (req, res)=>{
  if(req.session){
    req.session.destroy(()=>{
      console.log(req.session);
    })
    res.send("로그아웃 성공");
  }else{
    res.send("세션이 없습니다.");
  }
})

export default route;