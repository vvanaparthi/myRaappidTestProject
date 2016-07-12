

import helloService = require("../services/hello-service");
import hiService = require("../services/hi-service");


export function sayHelloAndHi():Promise<string>
{
    let hello:string = helloService.sayHello();

    return hiService.sayHi().then((result)=>{
        return hello + " " + result;
    });
}