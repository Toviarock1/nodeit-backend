const http = require("http");
const app = require("./app");
require("./startup/prod")(app);
const port = 5050 || process.env.port;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(`listening on localhost:${port}`);
});
