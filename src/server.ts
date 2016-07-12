
import path = require("path");
import http = require('http');

var connect = require('connect');
var serveStatic = require('serve-static');



var server;
var env = process.env.NODE_ENV || "development";
var staticPath:string = path.resolve("./");

export function start(port?:number,plugins?:Array<any>):void
{
    var httpPort = port;

    if(!httpPort || httpPort === 0)
    {
        httpPort = 3000;
    }

    var app = connect();

    if(plugins)
    {
        plugins.forEach((plugin)=>{
            app.use(plugin);
        })
    }


    if(env === "development")
    {
        app.use(serveStatic(staticPath,{'index': ['src/client/index.html']}))
    }
    else
    {
        staticPath = path.resolve("./dist/src/client");
        app.use(serveStatic(staticPath))
    }

    server = http.createServer(app).listen(httpPort);


    // Maintain a hash of all connected sockets
    var sockets = {}, nextSocketId = 0;
    server.on('connection', function (socket) {
        // Add a newly connected socket
        var socketId = nextSocketId++;
        sockets[socketId] = socket;

        // Remove the socket when it closes
        socket.on('close', function () {
            delete sockets[socketId];
        });
    });

    console.log("Server started");

    return server;
}

export function close()
{
    server.close();
}

if(env !== "development")
{
    start(process.env.PORT);
}
