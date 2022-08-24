"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishToScript = void 0;
const Shared_1 = require("./Shared");
//TODO: Add typings
function publishToScript(fName, settings, ...args) {
    for (const userScript of Shared_1.default.userScripts) {
        try {
            if (userScript[fName]) {
                const setting = settings.find(e => e.name == userScript._scriptname);
                userScript[fName](...args, (setting || { data: [] }).data);
            }
        }
        catch (ex) {
            console.error(`Error on script ${userScript._modulename} function ${fName}\n`, ex, '\n');
        }
    }
}
exports.publishToScript = publishToScript;
