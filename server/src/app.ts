import express, { Request, Response } from 'express';
import githubRouter from './routes/github.route';
import dotonv from 'dotenv';

dotonv.config();

const app = express();

app.use(express.json()); /* post시 body json으로 parse */

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world!');
});

app.use('/github', githubRouter);

app.listen(process.env.SERVER_PORT_NUM, () => {
  console.log(
    `[server]: Server is running at http://localhost:${process.env.SERVER_PORT_NUM}`
  );
});
