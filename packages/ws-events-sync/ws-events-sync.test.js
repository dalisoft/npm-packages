import assert from 'node:assert/strict';
import http from 'node:http';
import test from 'node:test';
import W3CWebSocket from 'websocket';
import { WebSocketServer } from 'ws';
import { Client, Server } from './ws-events-sync.js';

const createServer = () =>
  http.createServer((_req, res) => {
    res.write('server test');
    res.end();
  });

test('WebSocket.Server test', (_t) =>
  new Promise((resolve) => {
    const steps = [];

    const server = createServer();
    const ws = new WebSocketServer({
      path: '/ws',
      server
    });

    ws.on('connection', (ws) => {
      const wsWrapper = new Server(ws);

      steps.push('connection');

      wsWrapper.on('message', (data) => {
        steps.push('message');
        assert.equal(
          data,
          'client_message',
          'Message did not match to text from client'
        );
      });
      ws.on('close', () => {
        steps.push('close');
        assert.deepEqual(
          steps,
          ['connection', 'message', 'close'],
          'Server events did not run in expected order'
        );

        server.close();
        resolve();
      });

      wsWrapper.send('sent to client');
    });

    server.listen(11115, () => {
      const { port } = server.address();

      const client = new W3CWebSocket.w3cwebsocket(`ws://localhost:${port}/ws`);

      client.onopen = () => {
        client.send('client_message');
      };

      setTimeout(() => {
        client.close();
      }, 100);
    });
  }));

test('WebSocket.Client test', (_t) =>
  new Promise((resolve) => {
    const steps = [];

    const server = createServer();
    const ws = new WebSocketServer({
      path: '/ws',
      server
    });

    ws.on('connection', (ws) => {
      ws.send('server_message');
    });

    server.listen(11156, () => {
      const { port } = server.address();

      const client = new W3CWebSocket.w3cwebsocket(`ws://localhost:${port}/ws`);
      const wsClient = new Client(client);

      wsClient.on('open', () => {
        steps.push('open');
        client.send('client_message');
      });

      wsClient.on('message', (message) => {
        steps.push('message');
        assert.equal(
          message,
          'server_message',
          'Message did not match to text from server'
        );
      });

      wsClient.on('close', () => {
        steps.push('close');
        assert.deepEqual(
          steps,
          ['open', 'message', 'close'],
          'Client events did not run in expected order'
        );
        server.close();
        resolve();
      });

      setTimeout(() => {
        // ws@8 no longer closes existing connections on `close()`
        for (const socket of ws.clients) {
          socket.close();
        }
        ws.close();
      }, 100);
    });
  }));
