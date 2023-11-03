import express, {Request, Response} from 'express';
import session from 'express-session';
import session_config from '../../config/session';
import connection from "../../config/connection";
import dotenv from 'dotenv';
dotenv.config()

const route = express.Router();
route.use(session_config);
const get_access_token = async (code:any, redirect_uri:string)=>{
  try{
    const result = await fetch(process.env.GOOGLE_TOKEN_URL as string, {
      method: "POST",
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_PASSWORD,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',  
      })
    });
    const ret = await result.json();
    console.log(ret.access_token);
    return ret;
  }catch(err){
    console.log(err);
  }
};

const get_userinfo = async(access_token:string)=>{
  try{
    const response = await fetch(process.env.GOOGLE_USERINFO_URL as string, {
      headers:{
        Authorization: `Bearer ${access_token}`,
      },
    });
    return await response.json();
  }catch(err){
    console.log(err);
  }
};

route.get('/login', (req:Request, res:Response)=>{
  const url = process.env.GOOGLE_AUTH_URL
  // client id 추가하기
  + `?client_id=${process.env.GOOGLE_CLIENT_ID}`
  // redirect uri 추가하기
  + `&redirect_uri=${process.env.GOOGLE_LOGIN_REDIRECT_URI}`
  // 필수 옵션
  + `&response_type=code`
  // 가져올 정보
  + `&scope=email profile`;
  res.redirect(url);
});

route.get('/login/redirect', async (req:any, res)=> {
  const {code} = req.query;
  const token = await get_access_token(code, process.env.GOOGLE_LOGIN_REDIRECT_URI as string);
  const result = await get_userinfo(token.access_token);
  
  const select_sql:string = "SELECT * FROM google_user WHERE email=(?)"
  const select_param:string[] = [result.email];
  try{
    const sql_result:any[] = await connection.query(select_sql, select_param);
    if(sql_result[0].length>0){
      const update_sql = `UPDATE google_user SET access_token=(?) WHERE email=(?)`;
      const params = [token.access_token, sql_result[0][0].email];
      await connection.query(update_sql, params);
      const session_data = req.session;
      session_data.user = {
        email:sql_result[0][0].email,
        access_token:token.access_token
      };
      await session_data.save();
      console.log(req.session)
      res.send(sql_result[0][0]);
    }else{
      res.send("need to sign up");
    }
  }catch(err){
    console.log("mysql2 error : " + err);
    res.send(err);
  }
});

route.get("/logout", async (req:Request, res:Response)=>{
  console.log(req.session);
  if(req.session.user){
    try{
      const access_token = req.session.user.access_token;
      const logout_url = process.env.GOOGLE_LOGOUT_URL +`token=${access_token}`;
      await fetch(logout_url);
    }catch(err){
      console.log("session error : " + err);
    }
    req.session.destroy(()=>{
      console.log(req.session);
    });
    res.send("로그아웃 성공!");
  }else{
    res.send("세션이 없습니다.");
  }
});

route.get('/signup', (req, res)=>{
  const url = process.env.GOOGLE_AUTH_URL
  // client id 추가하기
  + `?client_id=${process.env.GOOGLE_CLIENT_ID}`
  // redirect uri 추가하기
  + `&redirect_uri=${process.env.GOOGLE_SIGNUP_REDIRECT_URI}`
  // 필수 옵션
  + `&response_type=code`
  // 가져올 정보
  + `&scope=email profile`   
  res.redirect(url);  
});

route.get('/signup/redirect', async(req:Request, res:Response)=>{
  const {code} = req.query;
  const token = await get_access_token(code, process.env.GOOGLE_SIGNUP_REDIRECT_URI as string);
  const result = await get_userinfo(token.access_token);
  const select_sql:string = "SELECT * FROM google_user WHERE email=(?)"
  const select_param:string[] = result.email;
  try{
    const result:any[] = await connection.query(select_sql, select_param);
    if(result.length==0){
      console.log(result);
      const sql:string = "INSERT INTO google_user (email, name, locale) VALUES (?, ?, ?)";
      const params:string[] = [result[0].email, result[0].name, result[0].locale];
      connection.query(sql, params);
      res.json(result[0]); 
    }else{
      res.json("already sign up");
    }
  }catch(err){
    console.log("mysql2 error : " + err);
  }
});

export default route