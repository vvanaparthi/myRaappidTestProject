
import helloService = require("../../../../src/client/systems/service_system/services/hello-service");
import hiService = require("../../../../src/client/systems/service_system/services/hi-service");
import myAssistant = require("../../../../src/client/systems/service_system/assistants/my-assistant");
import Promise = require("bluebird");
import Spy = jasmine.Spy;

describe('my-assistant Test cases', () => {

    describe("sayHelloAndHi",()=>{

        beforeEach(()=>{

            spyOn(helloService,"sayHello").and.returnValue("helloStub");

        });

        it("should resolve with hello and hi",(done)=>{

            spyOn(hiService,"sayHi").and.returnValue(Promise.resolve("hiStub"));
            myAssistant.sayHelloAndHi().then((result)=>{

                expect(result).toEqual("helloStub hiStub");
                done();
            })

        });

        it("should reject with error, if hi service rejected with error",(done)=>{

            spyOn(hiService,"sayHi").and.returnValue(Promise.reject(new Error("yay")));

            myAssistant.sayHelloAndHi().then(null,(error)=>{

                expect(error).toEqual(jasmine.any(Error));
                expect(error.message).toEqual("yay");
                done();
            })
        });

    });
});