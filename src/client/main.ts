
import {actionControl,Action,Event} from "./systems/index"

actionControl.subscribe(Event.HI_HELLO,(result:string)=>{

    console.log("Event Received:\n"+result);
});

//performing an action
actionControl.perform(Action.SAY_HI_AND_HELLO).then((result:string)=>{
    console.log("Action Performed:\n"+result);
    console.log(result);
});