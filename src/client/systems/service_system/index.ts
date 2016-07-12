

//importing managers
import myManager = require("./managers/my-manager");

import {actionControl} from "../comm_system/index"

export class Action
{
    static SAY_HI_AND_HELLO:string = "sayHiAndHello";
}

export class Event
{
    static HI_HELLO:string = "hiHello";
}

//register actions
actionControl.registerAction(Action.SAY_HI_AND_HELLO,myManager.sayHello);
