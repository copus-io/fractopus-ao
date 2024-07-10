
import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { RegisterRoutes } from './routes';



function start() {
  const app: Express = express();
  const port = 3001;
  RegisterRoutes(app);
  app.use("/docs", swaggerUi.serve, async (_req: express.Request, res: express.Response) => {
    return res.send(swaggerUi.generateHTML(await import('./swagger.json')));
  });

  app.listen(port, () => {
    console.log(`server running: http://localhost:${port}`);
  });
}

start();

