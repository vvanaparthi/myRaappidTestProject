
var util = require('./util');
var argv = require('minimist')(process.argv.slice(2));
var sass = require('node-sass');
var path = require("path");
var fs = require("fs-extra");

var cpy = require("cpy");
var pp = require('preprocess');


if(argv._ && argv._.length > 0) //look for release build
{
    var subCommand = argv._[0].toLowerCase();
    if(subCommand === "release")
    {
        buildRelease();
    }

}
else // will build both sass and typescript in the src directory
{
    util.exec("npm run clean", function (err) {

        if(err)
        {
            console.log(err);
            process.exit(1);
        }

        util.callTasksInSeries([
            {fn:buildTypescript},
            {fn:buildSASS}
        ],function(err){

            util.finishTask(null,err,true);
        })
    });

}

function buildSASS(cb) {

    var mainSassFilePath = path.resolve("./src/client/systems/view_system/styles/main.scss");
    var outFilePath = path.resolve("./src/client/systems/view_system/styles/main.css");

    sass.render({
        file: mainSassFilePath
    },function(error, result){

        if(!error)
        {
            fs.writeFile(outFilePath,result.css,"utf8",function(err){

                util.finishTask(cb,err,true);

            });
        }
        else
        {
            util.finishTask(cb,err,true);
        }

    });

}

function buildTypescript(cb,isRelease){

    var cmd = "tsc";

    if(!isRelease)
        cmd = cmd + " --sourceMap";

    util.exec(cmd, function (err) {

        util.finishTask(cb,err,true);
    });

}

function bundleFiles(cb,distDir){


    var stealTools = require("steal-tools");

    stealTools.build({
            main: "src/client/main",
            bundlesPath:distDir,
            config: path.resolve("./")+"/package.json!npm"
        },
        {
            minify: true,
            debug: false,
            bundleSteal: true
        }
    ).then(function(){

        util.finishTask(cb);

    },function(err){
        util.finishTask(cb,err);
    })
}

function copyIndexHtmlFile(cb,distDir){

    var indexFile = path.resolve("./src/client/index.html");
    var dest = distDir+"/src/client/index.html";
    pp.preprocessFile(indexFile,dest,{BUILD : "release"},function(err){

        util.finishTask(cb,err)
    })

}

function copyAssetsAndServerFiles(cb,distDir){

    cpy(["src/server.js",
         "src/client/**/*",
        "!src/client/**/*.js",
        "!src/client/**/*.ts",
        "!src/**/*.scss"],distDir,{cwd:process.cwd(),parents: true, nodir: true}).then(function(){

        util.finishTask(cb)

    },function(err){

        util.finishTask(cb,err)
    })

}

function buildRelease(){

    util.exec("npm run clean", function (err) {

        var distDir = path.resolve("./dist");


        util.callTasksInSeries(
            [
                {fn:buildTypescript,
                    args:[true]
                },

                {fn:buildSASS
                },

                {fn:bundleFiles,
                    args:[distDir]
                },

                {fn:copyAssetsAndServerFiles,
                    args:[distDir]
                },

                {fn:copyIndexHtmlFile,
                    args:[distDir]
                }
            ]
            ,function(err){

                util.finishTask(null,err,true);
            });

    });
}