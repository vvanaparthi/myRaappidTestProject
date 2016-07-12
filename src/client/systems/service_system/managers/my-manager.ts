
import myAssistant = require("../assistants/my-assistant");
import Promise  = require("bluebird");

export function sayHello():Promise<any>
{
    return new Promise((resolve,reject)=>{

        myAssistant.sayHelloAndHi().then((result)=>{

            resolve(result);

        },(error)=>{

            reject(error);
        })
    });
}