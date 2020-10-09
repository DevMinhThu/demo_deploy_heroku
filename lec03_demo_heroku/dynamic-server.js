const http = require("http");
const PORT = process.env.PORT || 3000;

function createHeader(res, title) {
    res.write(`
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
        </head>
        <style>
            body {
                font-size: 16px;
                width: 600px;
                font-family: Arial, Helvetica, sans-serif;
                margin: 0 auto;
            }

            .done {
                background-color: crimson;
                color: #fff;
            }
        
            .progress {
                background-color: blue;
                color: #fff;
            }
        
            .new {
                background-color: green;
                color: #fff;
            }

            .todos {
                border: 1px solid black;
            }
        
            .todos>li {
                list-style: none;
            }
        
            .cell {
                display: inline-block;
                width: 200px;
                padding: 5px;
                border-left: 1px solid black;
            }
        </style>
        
        <body>
            <h1>${title}</h1>
    `)
}

function createFooter(res) {
    res.write(`
        </ul>
        </body>
        </html>
    `)
}

let todos = [
    { title: 'Back-end exercise 1', status: 'Progress' },
    { title: 'Front-end exercise 1', status: 'New' },
]
function createBody(res, data) {
    res.write(`
        <a href="./new">Create to do</a>
        <ul class="todos">
            <li>
                <div class="cell">Title</div>
                <div class="cell status">Status</div>
        </li>
    `);

    data.forEach(todo => {
        const li = `
        <li class="${todo.status.trim().toLowerCase()}">
            <div class="cell">${todo.title}</div>
            <div class="cell status">${todo.status}</div>
        </li>
        `
        res.write(li);
    });
}

function createNewBody(res) {
    res.write(`
        <form action="./new" method="POST">
            <input name="title" type="text" placeholder="Title">
            <select name="status" id="">
                <option value="done">Done</option>
                <option value="progress">progress</option>
                <option value="new">new</option>
            </select>
            <input type="submit" value="Submit">
        </form>
    `)
}

function createHomePage(res) {
    createHeader(res, 'Todo List');
    createBody(res, todos);
    createFooter(res);
    res.end('');
}

function createNewPage(res) {
    createHeader(res, 'Create Todo');
    createNewBody(res);
    createFooter(res);
    res.end('');
}

function createNotFoundPage(res) {
    createHeader(res, 'Page not found!')
    createFooter(res);
    res.end('');
}

//Tach drawData thanh JSObject
function parseRawData(rawData) {
    const parts = rawData.split('&');
    let data = {};
    parts.forEach((part) => {
        let tmp = part.split('=');
        if (tmp.length == 2) {
            data[tmp[0].trim()] = tmp[1].trim();
        }
    });
    if(data.title) data.title = data.title.replace(/\+/g, ' ');
    return data;
}

function requestListener(req, res) {
    // console.log(req.method);

    if (req.url == "/") createHomePage(res);
    else if (req.url == '/new') {
        if (req.method == 'POST') {
            let rawData = '';
            req.on('data', (chunk) => {
                rawData += chunk;
            })
            req.on('end', () => {
                const todo = parseRawData(rawData);
                todos = [todo, ...todos];
                res.writeHead(301, { Location: '/' });
                res.end();
            })
        } else createNewPage(res);
    }
    else createNotFoundPage(res);
}

const server = http.createServer(requestListener);

server.listen(PORT, () => {
    console.log("Server is listening on port 3000");
})