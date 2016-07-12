
path = require("path");
var util = require('./util');
var tinylr = require('tiny-lr')();
var chokidar = require('chokidar');
var tinylrPort = 2000;
var httpPort = 3000;


var server;

util.exec("npm run build",function(){

    serve();

    myWatch(["src/**/*.html","src/**/*.scss","src/**/*.ts"],function(filePath){
        util.exec("npm run build",function(err){
            if(!err)
            {
                reload(filePath);
            }
            else
            {
                console.log(err);
            }
        })
    });

});


function serve(){

    server = require("../src/server");


    var reloadPlugin = require('connect-livereload')({
        port: tinylrPort,
        serverPort: httpPort
    });


    tinylr.listen(tinylrPort);

    server.start(httpPort,[reloadPlugin]);




    console.log('Server running at http://localhost:' + httpPort);
}

function reload(filePath){
    tinylr.changed({
        body: {
            files: [path.resolve('./' + filePath)]
        }
    });
}

function myWatch(filePaths,cb){
    chokidar.watch(filePaths).on('change', cb);
}

function exitHandler(options, err) {
    if (options.cleanup)
    {
        server.close();
    }
    if (err)
        console.log(err.stack);

    if (options.exit)
    {
        if(options.exitCode)
            process.exit(options.exitCode);
        else
            process.exit(0);

    }

}

process.on('exit', function(code){
    exitHandler.bind(null,{cleanup:true,exitCode:code});
});

//catches ctrl+c event
process.on('SIGINT', function(){
    exitHandler.bind(null, {exit:true,exitCode:1});
});

process.on('SIGTERM', function(){
    exitHandler.bind(null, {exit:true,exitCode:1});
});

process.on('SIGHUP', function(){
    exitHandler.bind(null, {exit:true,exitCode:1});
});

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true,exitCode:1}));