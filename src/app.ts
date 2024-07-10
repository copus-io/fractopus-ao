
import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World from TypeScript!');
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});