
import helloService = require("../../../../src/client/systems/service_system/services/hello-service")
import Spy = jasmine.Spy;

describe('hello-service Test cases', () => {

    describe("sayHello",()=>{

        it("should return hello",()=>{

            var logSpy:Spy = spyOn(console,"log");

            var result:string = helloService.sayHello();
            expect(result).toEqual("hello");
            expect(logSpy).toHaveBeenCalledWith("hello-service saying hello...");
        });

    });
});