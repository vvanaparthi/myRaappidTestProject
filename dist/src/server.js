"use strict";
var path = require("path");
var http = require('http');
var connect = require('connect');
var serveStatic = require('serve-static');
var server;
var env = process.env.NODE_ENV || "development";
var staticPath = path.resolve("./");
function start(port, plugins) {
    var httpPort = port;
    if (!httpPort || httpPort === 0) {
        httpPort = 3000;
    }
    var app = connect();
    if (plugins) {
        plugins.forEach(function (plugin) {
            app.use(plugin);
        });
    }
    if (env === "development") {
        app.use(serveStatic(staticPath, { 'index': ['src/client/index.html'] }));
    }
    else {
        staticPath = path.resolve("./dist/src/client");
        app.use(serveStatic(staticPath));
    }
    server = http.createServer(app).listen(httpPort);
    var sockets = {}, nextSocketId = 0;
    server.on('connection', function (socket) {
        var socketId = nextSocketId++;
        sockets[socketId] = socket;
        socket.on('close', function () {
            delete sockets[socketId];
        });
    });
    console.log("Server started");
    return server;
}
exports.start = start;
function close() {
    server.close();
}
exports.close = close;
if (env !== "development") {
    start(process.env.PORT);
}
