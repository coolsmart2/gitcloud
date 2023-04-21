import express, { Request, Response } from 'express';
import logger from 'morgan';
import dotonv from 'dotenv';
import cors from 'cors';
import githubRouter from './routes/github.route';

dotonv.config();

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// app.use(express.static(__dirname + 'public')); // TODO: 동작 안함...
app.use(logger('dev'));
app.use(express.json()); /* post시 body json으로 parse */
app.use(
  cors({
    origin: 'http://127.0.0.1:5173',
    credentials: true,
  })
);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world!');
});

app.use('/github', githubRouter);

app.listen(process.env.SERVER_PORT_NUM, () => {
  console.log(
    `[server]: Server is running at http://localhost:${process.env.SERVER_PORT_NUM}`
  );
});
