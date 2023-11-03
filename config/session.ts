import session, {Session} from 'express-session'
import detenv from 'dotenv'

detenv.config();

export default session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
})