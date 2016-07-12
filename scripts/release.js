
var util = require('./util');
var argv = require('minimist')(process.argv.slice(2));
var fs = require("fs-extra");
var path = require("path");

if(argv._ && argv._.length > 0) //look release build
{

    var version;
    var cmd = "npm version --no-git-tag-version " + argv._[0];

    util.series(["npm test",

        "npm run build-release"],function(err){

        if(err)
        {
            console.log(err);
            process.exit(1);
        }
        else
        {
            require("child_process").exec(cmd,function(error,stdout,stdbffr){

                var version = JSON.parse(fs.readFileSync(path.resolve("./package.json"), 'utf8')).version;
                var tagName = "v"+version;

                console.log(tagName);


                if(error)
                {
                    console.log(err);
                    process.exit(1);
                }
                else
                {
                    util.series([

                        ["git add -A","Adding all the changed files after versioning"],

                        ['git commit -m "release"',"all changes committed..."],

                        ["git push","Pushed all file changes to remote repo.."],

                        ["git checkout -b release","Created local 'release' branch..."],

                        ["git add --f dist","dist folder added to release branch..."],

                        ['git commit -m "release"',"all changes committed..."],

                        ["git tag " + tagName,"created version tag..."],

                        ['git push --tags', "all tags pushed..."],

                        ['git checkout master',"checked out master branch.."],

                        ['git branch -D release',"release branch deleted..release Done!!"]

                    ],function(err){

                        if(err)
                        {
                            util.series(["git checkout master","git branch -D release"],function(error){
                                console.log(err);
                                process.exit(1);
                            })
                        }

                        process.exit(0);
                    });
                }

            });
        }
    });




}
else
{
    console.log("\n Cannot Recognize the type of release. Please see instructions below");
    console.log('\n Options:\n\n raapid-release [release-type]' +
        '      --- Give type of release:  major | minor | patch | premajor | preminor | prepatch | prerelease\n'
    );

    process.exit(1);
}

