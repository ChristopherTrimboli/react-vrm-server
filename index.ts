import { WebSocketServer } from "ws";

const wss = new WebSocketServer({
    port: Number(process.env.PORT) || 80
});

const users: any = {};

wss.on('connection', (ws) => {
    let userId = "";

    ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        console.log(message);
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