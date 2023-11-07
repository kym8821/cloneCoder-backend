import bcrypt from 'bcrypt';
import dotenv from 'dotenv'

dotenv.config();

const getHashedPassword = async (password:string) =>{
  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUND));
  const hashedPassword:string = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export default getHashedPassword