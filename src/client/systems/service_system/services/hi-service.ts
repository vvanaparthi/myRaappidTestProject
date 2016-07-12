

export function sayHi():Promise<string>
{
    console.log("hi-service saying hi...");
    return Promise.resolve("hi");
}