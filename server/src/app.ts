import express, { Request, Response } from 'express';
import logger from 'morgan';
import dotonv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import MemoryStore from 'memorystore';
import cookieParser from 'cookie-parser';
import githubRouter from './routes/github.route';
import userRouter from './routes/user.route';

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

dotonv.config();

const app = express();

const corsOptions = {
  origin: ['http://127.0.0.1:4173', 'http://127.0.0.1:5173'],
  credentials: true,
};

const SessionStore = MemoryStore(session);
const sessionStore = new SessionStore({});

app.use(cors(corsOptions));
app.use(express.json()); /* post시 body json으로 parse */
app.use(logger('dev'));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
    },
    store: sessionStore,
  })
);

app.use('/user', userRouter);
app.use('/github', githubRouter);

app.get('/', async (req: Request, res: Response) => {
  res.send('GitCloud API Server');
});

app.listen(process.env.SERVER_PORT_NUM, () => {
  console.log(
    `[server]: Server is running at http://localhost:${process.env.SERVER_PORT_NUM}`
  );
});
