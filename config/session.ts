import session, {Session} from 'express-session'
import dotenv from 'dotenv'

dotenv.config();
const session_config = session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
})

export default session_config; 