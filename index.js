// require your server and launch it here

const server = require("./api/server");

const PORT = process.env.PORT;

server.listen(PORT || 5000, () => {
  console.log(`listening on ${PORT}`);
});
