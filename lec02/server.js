// import module
const http = require("http");
const fs = require("fs");
const path = require("path"); // Thư viện về đường dẫn

// hàm sử lý các request được gửi đến
function requestHandler(req, res) {
  // req.url == "/": so sánh req.url có bằng / không
  // Nếu bằng trả về index.html
  // Nếu không thì trả về chính req.url hiện tại

  req.url = req.url == "/" ? "index.html" : req.url;
  const tmp = req.url.split("/"); // tách nhỏ URL ra
  if (tmp.length > 1) {
    console.log(tmp[1]); // trả về abc
    console.log(tmp[tmp.length - 1]); // trả về abc
    if (tmp[tmp.length - 1].indexOf(".") < 0) {
      req.url = path.join(req.url, "abc.html");
    }
  }

  //console.log(path.join(__dirname, req.url));
  fs.createReadStream(path.join(__dirname, "public", req.url))
    .on("error", (err) => {
      res.statusCode = 404;
      res.end("Page not found.");
    })
    .pipe(res); // Tạo 1 connect từ dữ liệu tới Browser
}

// Create Server
const server = http.createServer(requestHandler);

// listen port
server.listen(8080, () => {
  console.log("Listening port 8080.");
});
