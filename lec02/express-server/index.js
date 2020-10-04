// Sẽ thay thế cho tất cả những gì đã code ở file server.js như trước
const express = require("express");

const app = express();
app.use(express.static("./public"));
app.use('/app2', express.static('./app2'));
app.use('/app3', express.static('./app3'));

app.listen(4040, () => {
  console.log("Server listening port 4040");
});

