
import myAssistant = require("../../../../src/client/systems/service_system/assistants/my-assistant");
import myManager = require("../../../../src/client/systems/service_system/managers/my-manager");

describe('my-manager Integration Test cases', () => {

    describe("sayHello",()=>{

        it("should resolve with hello and hi",(done)=>{

            myManager.sayHello().then((result)=>{

                expect(result).toEqual("hello hi");
                done();
            })

        });

    });
});