import express from 'express';
import bodyParser from 'body-parser';
import connection from '../../../config/connection';
import getHashedPassword from '../../../config/hashing';
import bcrypt from 'bcrypt'
import cors from 'cors'

const route = express.Router();
route.use(bodyParser.urlencoded({extended:true}));
route.use(express.json())
route.use(cors())

// /local/signin
route.post("/", async (req, res)=>{
  const userInfo = req.body;
  console.log(userInfo)
  if(userInfo.local_id===undefined || userInfo.email===undefined){
    res.send("잘못된 입력입니다");
    return;
  }
  const selectSql = `SELECT * FROM user WHERE email=(?) OR local_id=(?)`;
  const selectSqlParams = [userInfo.email, userInfo.local_id];
  try{
    const selectSqlResult:any[] = await connection.query(selectSql, selectSqlParams);
    console.log(selectSqlResult)
    if(selectSqlResult[0].length>0){
      return res.json({
        status:"404",
        data:undefined
      });
    }else{
      const insertSql = `INSERT INTO user (local_id, local_password, email, name) VALUES (?, ?, ?, ?)`;
      const insertParams = [userInfo.local_id, await getHashedPassword(userInfo.local_password), userInfo.email, userInfo.name];
      console.log(insertParams)
      await connection.query(insertSql, insertParams);
      return res.json({
        status:"200",
        data:userInfo
      });
    }
  }catch(err){
    console.log("local signup sql error : " + err);
    return res.send("local signup sql error : " + err);
  }
});

export default route;