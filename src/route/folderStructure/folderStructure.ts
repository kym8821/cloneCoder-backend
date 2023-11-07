import express from 'express'
import session_config from '../../../config/session'
import connection from '../../../config/connection';
import bodyParser from 'body-parser'
import Folder from '../../../DB/Folder';
import File from '../../../DB/File';

const tmp_user = '36670ddf-7d86-11ee-b07a-00155d703af8';
const route = express.Router()
route.use(session_config)
route.use(express.json())
route.use(bodyParser.urlencoded({extended:true}))

route.get("/get", async (req, res)=>{
  if(!req.session.user){
    return res.json({
      status:400,
      message:"로그인 먼저 해야합니다",
      data:undefined
    })
  }  
  const selectSql = 'SELECT * FROM folder WHERE user_id=?'
  const selectSqlParams = [tmp_user]
  try{
    const sqlResult:any[] = await connection.query(selectSql, selectSqlParams);
    const folderData:Folder[] = sqlResult[0]
    for(let i=0; i<folderData.length; i++){
        const userId = folderData[i].user_id;
        const folderId = folderData[i].id
        const selectFileSql = 'SELECT * FROM file WHERE user_id=? AND folder_id=?'
        const selectFIleSqlParams = [userId, folderId];
        const fileData:File[] = (await connection.query(selectFileSql, selectFIleSqlParams) as any[])[0];
        folderData[i].file = fileData;
    }
    return res.json({
      status:200,
      message:"정보 조회 성공",
      data:folderData
    })
  }catch(err){
    console.log(err)
    return res.json({
      status:500,
      message:err,
      data:undefined
    });
  }

});

export default route