import { Server } from "ws";
import express from "express";

const INDEX = '/index.html';
const PORT = Number(process.env.PORT) || 80;

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

const users: any = {};

wss.on('connection', (ws) => {
    let userId = "";

    ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        switch (message.type) {
            case "position": {
                userId = message.userId;
                users[message.userId] = {
                    x: message.x,
                    y: message.y,
                    z: message.z
                };
                break;
            }
            default:
                break;
        }
    });

    ws.on("close", () => {
        delete users[userId]
    })
    setInterval(() => {
        ws.send(JSON.stringify({
            type: "users",
            users
        }));
    }, 100)
});