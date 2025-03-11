const http = require("http");
const { WebSocketServer } = require("ws");
const uuidv4 = require("uuid").v4;

const url = require("url");

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
  const message = JSON.parse(bytes.toString());
  const user = users[uuid];
  user.state = message;
console.log(`${user.username} updated their state ${JSON.stringify(user.state)}`)
  brodcast();
};

const handleClose = (uuid) => {
  delete connections[uuid];
  delete users[uuid];

  brodcast();
};

wsServer.on("connection", (connection, request) => {
  const { username } = url.parse(request.url, true).query;
  const uuid = uuidv4();
  connections[uuid] = connection;
  users[uuid] = {
    username,
    state: {},
  };
  console.log(users,"users")

  connection.on("message", (message) => handleMessage(message, uuid));
  connection.on("close", () => handleClose(uuid));
});

server.listen(port, () => {
  console.log(`web socket server running on port number ${port}`);
});
