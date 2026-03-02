import WebSocket = require("ws");

let wss: WebSocket.Server;

function initWebSocket(server: any) {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws: any, req: any) => {
    const path = req.url || "/";

    if (path === "/customer") ws.role = "customer";
    else if (path === "/manager") ws.role = "manager";

    ws.on("message", (msg: string) => {
      try {
        const data = JSON.parse(msg.toString());

        // broadcast to everyone except sender
        sendToAll(data, ws);
      } catch (err) {
        console.error("Invalid WS message", err);
      }
    });

    ws.on("close", () => {});
  });

  return wss;
}

function sendToAll(data: any, sender: any | null = null) {
  if (!wss) return;

  const message = JSON.stringify(data);

  wss.clients.forEach((client: any) => {
    if (client.readyState !== WebSocket.OPEN) return;
    if (sender && client === sender) return;

    client.send(message);
  });
}

export { initWebSocket, sendToAll };
