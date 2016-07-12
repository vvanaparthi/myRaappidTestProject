
import hiService = require("../../../../src/client/systems/service_system/services/hi-service")
import Spy = jasmine.Spy;

describe('hi-service Test cases', () => {

    describe("sayHi",()=>{


        it("should resolve with hi",(done)=>{

            var logSpy:Spy = spyOn(console,"log");

            hiService.sayHi().then((result)=>{

                expect(result).toEqual("hi");
                expect(logSpy).toHaveBeenCalledWith("hi-service saying hi...");
                done();
            });
        });

    });
});