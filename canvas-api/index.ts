import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import config from './config';
import {WebSocket} from 'ws';

const app = express();
const port = 8000;
expressWs(app);

app.use(cors(config.corsOptions));

const router = express.Router();

const connectedClients: WebSocket[] = [];

router.ws('/canvas', (ws, req) => {
  console.log('client connected');
  connectedClients.push(ws);


  ws.on('close', () => {
    console.log('client disconnected');
    const index = connectedClients.indexOf(ws);
    connectedClients.splice(index, 1);
  });
});

app.use(router);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});