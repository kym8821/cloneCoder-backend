// 1. cors : fetch 실패 시 주 원인임 --> cors를 사용하도록 해서 fetch가 실패하지 않도록 한다.
// 2. bodyParser : req.body의 값을 편하게 얻을 수 있도록 한다.
// 3. express.json() : req의 body를 json으로 바꿔준다. --> 인식 가능

import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import session_config from "../../../config/session";
import session from 'express-session';
import connection from '../../../config/connection';
import cors from 'cors'

const route = express.Router();
route.use(session_config);
route.use(express.json());
route.use(bodyParser.urlencoded({extended:true}));
route.use(cors());

// /local/login
route.post('/', async (req, res)=>{
  const userInfo = req.body;
  console.log(userInfo.local_id + userInfo.local_password);
  if(userInfo.local_id==undefined || userInfo.local_password==undefined){
    return res.json({
      status:404,
      data:undefined
    });
  };
  const selectSql = `SELECT * FROM user WHERE local_id=(?)`;
  const selectSqlParams = [userInfo.local_id];
  try{
    const selectSqlResult:any[] = await connection.query(selectSql, selectSqlParams);
    if(selectSqlResult[0].length>0 && await bcrypt.compare(userInfo.local_password, selectSqlResult[0][0].local_password)){
      const session_data = req.session;
      session_data.user = {
        local_id:selectSqlResult[0][0].local_id,
        email:selectSqlResult[0][0].email,
        name:selectSqlResult[0][0].name
      }
      await session_data.save();
      console.log(req.session);
      return res.json({
        status:200,
        data:session_data.user
      })
    }else{
      return res.json({
        status:400,
        data:undefined
      })
    }
  }catch(err){
    console.log("local login sql error : " + err);
    return res.send("local login sql error : " + err);
  }
});

export default route;