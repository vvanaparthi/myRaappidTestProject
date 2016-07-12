
import actionControl1 = require("../../../src/client/systems/comm_system/action-control");
import Promise = require('bluebird');
import any = jasmine.any;
import Spy = jasmine.Spy;
import {Errors} from "../../../src/client/systems/comm_system/index";

describe('action-control', function() {
    
    var actionControl:any = actionControl1;
    var throws;

    beforeEach(function (done) {
        throws = null;
        done();
    });

    var actionNumber:number = 0;
    function registerAction(handler,handlerContext?):string
    {
        var action:string = "action"+actionNumber;
        actionControl.registerAction("action"+actionNumber,handler,handlerContext);
        actionNumber++;
        return action;
    }

    describe("registerAction",()=>{
        it('should throw an error when registering action with actionName not of type string', function(done) {
            throws = function() {
                actionControl.registerAction({});
            };
            expect(throws).toThrowError(Errors.ERROR_REGISTERING_ACTION_NAME_NOT_TYPE_STRING);

            throws = function() {
                actionControl.registerAction();
            };
            expect(throws).toThrowError(Errors.ERROR_REGISTERING_ACTION_NAME_NOT_TYPE_STRING);

            throws = function() {
                actionControl.registerAction(null);
            };
            expect(throws).toThrowError(Errors.ERROR_REGISTERING_ACTION_NAME_NOT_TYPE_STRING);

            done();
        });

        it('should throw an error when no handler is passed, while registering an action', function(done) {

            throws = function() {
                actionControl.registerAction("action");
            };

            expect(throws).toThrowError(Errors.ERROR_REGISTERING_ACTION_NO_HANDLER_GIVEN);

            throws = function() {
                actionControl.registerAction("event",null);
            };

            expect(throws).toThrowError(Errors.ERROR_REGISTERING_ACTION_NO_HANDLER_GIVEN);

            done();
        });

        it('should throw an error when handler is not of type function, while registering an action', function(done) {

            throws = function() {
                actionControl.registerAction("event",{});
            };

            expect(throws).toThrowError(Errors.ERROR_REGISTERING_ACTION_HANDLER_NOT_TYPE_FUNCTION);
            done();
        });

        it('should throw an error when handler is already set for the action', function(done) {

            actionControl.registerAction("event",function(){});
            throws = function() {
                actionControl.registerAction("event",function(){});
            };

            expect(throws).toThrowError(Errors.ERROR_REGISTERING_ACTION_ONLY_ONE_HANDLER_ALLOWED);
            done();
        });
    });

    describe("unregisterAction",()=>{
        it('should throw an error when trying to un-register from an action not of type string', function(done) {
            throws = function() {
                actionControl.unregisterAction({});
            };
            expect(throws).toThrowError(Errors.ERROR_UNREGISTERING_ACTION_NAME_NOT_TYPE_STRING);

            throws = function() {
                actionControl.unregisterAction();
            };
            expect(throws).toThrowError(Errors.ERROR_UNREGISTERING_ACTION_NAME_NOT_TYPE_STRING);

            throws = function() {
                actionControl.unregisterAction(null);
            };
            expect(throws).toThrowError(Errors.ERROR_UNREGISTERING_ACTION_NAME_NOT_TYPE_STRING);

            done();
        });

        it('should throw an error when no handler is passed while un-registering to an anction', function(done) {

            throws = function() {
                actionControl.unregisterAction("event");
            };

            expect(throws).toThrowError(Errors.ERROR_UNREGISTERING_ACTION_NO_HANDLER_GIVEN);

            throws = function() {
                actionControl.unregisterAction("event",null);
            };

            expect(throws).toThrowError(Errors.ERROR_UNREGISTERING_ACTION_NO_HANDLER_GIVEN);

            done();
        });

        it('should throw an error when trying to un-register with handler not of type function', function(done) {

            throws = function() {
                actionControl.unregisterAction("event",{});
            };
            expect(throws).toThrowError(Errors.ERROR_UNREGISTERING_ACTION_HANDLER_NOT_TYPE_FUNCTION);
            done();
        });

        it('should successfully unregister action', function(done) {

            function handler():void
            {

            }
            actionControl.registerAction("action",handler);
            actionControl.unregisterAction("action",handler);
            expect(actionControl.hasAction("action")).toBe(false);
            done();
        });
    });

    describe("perform",()=>{
        it('should throw an error when taking action name not of type string', function(done) {

            throws = function() {
                actionControl.perform({});
            };
            expect(throws).toThrowError(Errors.ERROR_TAKING_ACTION_ACTION_NAME_NOT_TYPE_STRING);
            done();
        });

        it('should throw an error when no handler found for the action', function(done) {

            throws = function() {
                actionControl.perform("action");
            };
            expect(throws).toThrowError(Errors.ERROR_TAKING_ACTION_NO_HANDLER_REGISTERED);
            done();
        });

        it('should successfully call any handler associated with the action', function(done) {

            var handler = function(data){
                done();
            };

            var action = registerAction(handler);

            actionControl.perform(action);
        });

        it('should successfully call handler associated with the action, with appropriate parameters', function(done) {

            var paramA = "A";
            var paramB = {};
            var handler = function(param1,param2){

                expect(arguments.length).toEqual(2);
                expect(param1).toEqual(paramA);
                expect(param2).toEqual(paramB);
                done();
            };

            var action = registerAction(handler);

            actionControl.perform(action,paramA,paramB);

        });

        it('should call the handler with right context if the context is passed while registering', function(done) {

            var handlerContext ={};
            var paramA = "A";
            var paramB = {};
            var handler = function(param1,param2){

                expect(this).toEqual(handlerContext);
                done();
            };

            var action = registerAction(handler,handlerContext);

            actionControl.perform(action,paramA,paramB);

        });

        it('should call the handler with undefined context if no context is passed while registering', function(done) {

            var handler = function(){

                expect(this).toEqual(undefined);
                done();
            };

            var action = registerAction(handler);
            actionControl.perform(action);

        });

        it('should return a promise, when handler returns a promise', function(done) {

            var handler = function(data){
                return new Promise(function(){});
            };
            var action = registerAction(handler);

            var result = actionControl.perform(action, "humm");

            expect(result).toEqual(jasmine.any(Promise));
            done();
        });

        it('should return a promise, when handler returns a value', function(done) {

            var handler = function(data){
                return true;
            };
            var action = registerAction(handler);

            var result = actionControl.perform(action, "humm");

            expect(result).toEqual(jasmine.any(Promise));
            done();
        });

        it('should reject with error if handler throws error', function(done) {

            var handler = function(data){
                throw new Error("yay");
            };
            var action = registerAction(handler);

            var result = actionControl.perform(action, "humm");

            expect(result).toEqual(jasmine.any(Promise));

            result.then(null,(error)=>{
                expect(error).toEqual(jasmine.any(Error));
                expect(error.message).toEqual("yay");
                done();
            })

        });
    });


    describe("hasAction",()=>{
        it('should return true if action registered', function(done) {
            var action = registerAction(function(){});

            expect(actionControl.hasAction(action)).toBe(true);
            done();
        });

        it('should return false if no action registered', function(done) {
            expect(actionControl.hasAction("ewrwer")).toBe(false);
            done();
        });
    });



    //testing the event stream functionality

    describe("subscribe",()=>{


        it('should throw an error when subscribing with event not of type string', function(done) {
            throws = function() {
                actionControl.subscribe({});
            };
            expect(throws).toThrowError(Errors.ERROR_SUBSCRIBING_EVENT_NAME_NOT_TYPE_STRING);

            throws = function() {
                actionControl.subscribe();
            };
            expect(throws).toThrowError(Errors.ERROR_SUBSCRIBING_EVENT_NAME_NOT_TYPE_STRING);

            throws = function() {
                actionControl.subscribe(null);
            };
            expect(throws).toThrowError(Errors.ERROR_SUBSCRIBING_EVENT_NAME_NOT_TYPE_STRING);

            done();
        });

        it('should throw an error when no handler is passed while subscribing to an event', function(done) {

            throws = function() {
                actionControl.subscribe("event");
            };

            expect(throws).toThrowError(Errors.ERROR_NO_HANDLER_WHILE_SUBSCRIBING);

            throws = function() {
                actionControl.subscribe("event",null);
            };

            expect(throws).toThrowError(Errors.ERROR_NO_HANDLER_WHILE_SUBSCRIBING);

            done();
        });

        it('should throw an error when handler is not of type function', function(done) {

            throws = function() {
                actionControl.subscribe("event",{});
            };

            expect(throws).toThrowError(Errors.ERROR_SUBSCRIBING_HANDLER_NOT_TYPE_FUNCTION);
            done();
        });

        it('should allow to subscribe to event of type string', function(done) {

            actionControl.subscribe("event", function(data){});
            expect(actionControl.hasSubscribers("event")).toBe(true);
            done();
        });
    });

    describe("publish",()=>{


        it('should throw an error when trying to publish event not of type string', function(done) {

            throws = function() {
                actionControl.publish({});
            };
            expect(throws).toThrowError(Errors.ERROR_PUBLISHING_EVENT_NAME_NOT_TYPE_STRING);

            throws = function() {
                actionControl.publish();
            };
            expect(throws).toThrowError(Errors.ERROR_PUBLISHING_EVENT_NAME_NOT_TYPE_STRING);

            throws = function() {
                actionControl.publish(null);
            };
            expect(throws).toThrowError(Errors.ERROR_PUBLISHING_EVENT_NAME_NOT_TYPE_STRING);

            done();
        });

        it('should successfully publish event of type string to all the handlers', function(done) {

           var eventData:any = {};
           var spy1:Spy = jasmine.createSpy("spy1");
           var spy2:Spy = jasmine.createSpy("spy2");

            actionControl.subscribe("event", spy1);
            actionControl.subscribe("event", spy2);

            actionControl.publish("event",eventData);

            expect(spy1).toHaveBeenCalledWith(eventData);
            expect(spy1).toHaveBeenCalledTimes(1);
            expect(spy2).toHaveBeenCalledWith(eventData);
            expect(spy2).toHaveBeenCalledTimes(1);
            done();

        });


        it('should call the handler with right context if the context is passed while subscribing', function(done) {

            var handlerContext ={};
            var handler = function(){

                expect(this).toEqual(handlerContext);
                done();
            };

            actionControl.subscribe("action123123",handler,handlerContext);
            actionControl.publish("action123123");

        });

        it('should call the handler with undefined context if no context is passed while subscribing', function(done) {


            var handler = function(){

                expect(this).toEqual(undefined);
                done();
            };

            actionControl.subscribe("action",handler);
            actionControl.publish("action");

        });
    });

    describe("unSubscribe",()=>{
        it('should throw an error when trying to unsubscribe from an event not of type string', function(done) {
            throws = function() {
                actionControl.unSubscribe({});
            };
            expect(throws).toThrowError(Errors.ERROR_UNSUBSCRIBING_EVENT_NAME_NOT_TYPE_STRING);

            throws = function() {
                actionControl.unSubscribe();
            };
            expect(throws).toThrowError(Errors.ERROR_UNSUBSCRIBING_EVENT_NAME_NOT_TYPE_STRING);

            throws = function() {
                actionControl.unSubscribe(null);
            };
            expect(throws).toThrowError(Errors.ERROR_UNSUBSCRIBING_EVENT_NAME_NOT_TYPE_STRING);

            done();
        });

        it('should throw an error when no handler is passed while unsubscribing to an event', function(done) {

            throws = function() {
                actionControl.unSubscribe("event");
            };

            expect(throws).toThrowError(Errors.ERROR_NO_HANDLER_WHILE_UNSUBSCRIBING);

            throws = function() {
                actionControl.unSubscribe("event",null);
            };

            expect(throws).toThrowError(Errors.ERROR_NO_HANDLER_WHILE_UNSUBSCRIBING);

            done();
        });

        it('should throw an error when trying to unsubscribe with handler not of type function', function(done) {

            throws = function() {
                actionControl.unSubscribe("event",{});
            };
            expect(throws).toThrowError(Errors.ERROR_UNSUBSCRIBING_HANDLER_NOT_TYPE_FUNCTION);
            done();
        });

        it('should allow to unsubscribe an handler for an event if it is registered', function(done) {

            var handler1 = function(data){};

            var handler2 = function(data){};

            actionControl.subscribe("event", handler1);
            actionControl.subscribe("event", handler2);

            expect(actionControl.hasSubscribers("event")).toBe(true);

            actionControl.unSubscribe("event",handler1);
            expect(actionControl.hasSubscribers("event")).toEqual(true);

            done();
        });
    });

});
