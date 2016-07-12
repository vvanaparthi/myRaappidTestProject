

if(process.env.NODE_ENV === "production")
{
    //doing the production build here before deploying to heroku

    var util = require('./util');

    util.exec("npm run build-release",function(error){
        if(error)
        {
            console.log(error);
            process.exit(1)
        }
        else
        {
            process.exit(0);
        }
    })
}