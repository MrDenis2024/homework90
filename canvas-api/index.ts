import express from 'express';
import expressWs from 'express-ws';
import cors from 'cors';
import config from './config';
import {WebSocket} from 'ws';
import {IncomingMessage, Pixel} from './types';

const app = express();
const port = 8000;
expressWs(app);

app.use(cors(config.corsOptions));

const router = express.Router();

const connectedClients: WebSocket[] = [];
const pixels: Pixel[] = [];

router.ws('/canvas', (ws, req) => {
  console.log('client connected');
  connectedClients.push(ws);
  ws.send(JSON.stringify({type: 'INIT', payload: pixels}));

  ws.on('message', (message) => {
    try {
      const decodedMessage = JSON.parse(message.toString()) as IncomingMessage;

      if(decodedMessage.type === 'DRAW') {
        const newPixel = decodedMessage.payload;
        pixels.push(...newPixel);
        connectedClients.forEach((clientWs) => {
          clientWs.send(JSON.stringify({
            type: 'NEW_DRAW',
            payload: decodedMessage.payload,
          }));
        });
      }

    } catch (e) {
      ws.send(JSON.stringify({type: 'ERROR', payload: 'Invalid message'}));
    }
  });

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