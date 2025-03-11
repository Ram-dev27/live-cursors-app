const http = require("http");
const { WebSocketServer } = require("ws");

const url = require("url");
const uuidv4 = require("uuid").v4;

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;

const connections = {};
const users = {};

const brodcast = () => {
  Object.keys(connections).forEach((uuid) => {
    const connection = connections[uuid];
    const message = JSON.stringify(users);
    connection.send(message);
  });
};

const handleMessage = (bytes, uuid) => {
  // message = {"x":0, "y":23}
  const message = JSON.parse(bytes.toString());
  const user = users[uuid];
  user.state = message;

  brodcast();

  console.log(message);
};

const handleClose = (uuid) => {
  const connection = connections[uuid];

  delete connections[uuid];
  delete users[uuid];

  brodcast();
};

wsServer.on("connection", (connection, request) => {
  // ws://localhost:8000?username="Ram"
  const { username } = url.parse(request.url, true).query;
  const uuid = uuidv4();
  console.log(username);
  console.log(uuid);

  connections[uuid] = connection;
  users[uuid] = {
    username,
    state: {},
  };

  connection.on("message", (message) => handleMessage(message, uuid));
  connection.on("close", () => handleClose(uuid));
});

server.listen(port, () => {
  console.log(`WebSocket server is runing on port ${port}`);
});
