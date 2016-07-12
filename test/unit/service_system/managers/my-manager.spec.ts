
import myAssistant = require("../../../../src/client/systems/service_system/assistants/my-assistant");
import myManager = require("../../../../src/client/systems/service_system/managers/my-manager");

describe('my-manager Test cases', () => {

    describe("sayHello",()=>{

        it("should resolve with hello and hi",(done)=>{

            spyOn(myAssistant,"sayHelloAndHi").and.returnValue(Promise.resolve("humm"));

            myManager.sayHello().then((result)=>{

                expect(result).toEqual("humm");
                done();
            })

        });

        it("should reject with error, if assistant rejects with error",(done)=>{

            spyOn(myAssistant,"sayHelloAndHi").and.returnValue(Promise.reject(new Error("yay")));

            myManager.sayHello().then(null,(error)=>{

                expect(error).toEqual(jasmine.any(Error));
                expect(error.message).toEqual("yay");
                done();
            })
        });

    });
});