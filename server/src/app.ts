import express, { Request, Response } from 'express';
import logger from 'morgan';
import dotonv from 'dotenv';
import cors from 'cors';
import githubRouter from './routes/github.route';
import pool from './database/mysql';

dotonv.config();

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

const corsOptions = {
  origin: ['http://127.0.0.1:5173'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json()); /* post시 body json으로 parse */
// app.use(express.static(__dirname + 'public')); // TODO: 동작 안함...

app.use('/github', githubRouter);

app.get('/', async (req: Request, res: Response) => {
  let conn = null;
  try {
    conn = await pool.getConnection();
    console.log(conn);
    const result = await conn.query('SELECT * FROM user');
    console.log(result?.[0]);
    res.send('Hello world!');
  } catch (error) {
    res.send(error);
  } finally {
    if (conn) conn.release();
  }
});

app.listen(process.env.SERVER_PORT_NUM, () => {
  console.log(
    `[server]: Server is running at http://localhost:${process.env.SERVER_PORT_NUM}`
  );
});
