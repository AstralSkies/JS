const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

const players = new Map();

server.on('connection', (socket) => {
    const playerId = Math.random().toString(36).substr(2, 9);
    players.set(playerId, { x: 5, y: 5 });

    socket.send(JSON.stringify({ type: 'id', id: playerId }));
    socket.send(JSON.stringify({ type: 'players', players: Array.from(players.values()) }));

    socket.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'move') {
            const player = players.get(playerId);
            player.x = data.x;
            player.y = data.y;
            server.clients.forEach((client) => {
                if (client !== socket && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'playerUpdate', id: playerId, x: data.x, y: data.y }));
                }
            });
        }
    });

    socket.on('close', () => {
        players.delete(playerId);
        server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'playerRemoved', id: playerId }));
            }
        });
    });
});