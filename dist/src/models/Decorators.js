"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arg = exports.res = exports.desc = exports.classDocs = exports.sSym = void 0;
exports.sSym = Symbol("docs");
function classDocs(value) {
    return function (constructor) {
        return class extends constructor {
            constructor(...args) {
                super(...args);
                const result = { isClass: true, value: value || constructor.name };
                this[exports.sSym].push(result);
            }
        };
    };
}
exports.classDocs = classDocs;
function desc(value) {
    return function (target, propertyKey, descriptor) {
        const result = { desc: value, name: propertyKey, isMethod: true };
        target[exports.sSym].push(result);
    };
}
exports.desc = desc;
function res(value) {
    return function (target, propertyKey, descriptor) {
        const valueType = typeof value;
        const result = { isRet: true, type: value.name };
        if (valueType === "string" || valueType === "number" || valueType === "boolean")
            result.type = valueType;
        target[exports.sSym] = target[exports.sSym] || [];
        target[exports.sSym].push(result);
    };
}
exports.res = res;
function arg(name, value) {
    return function (target, propertyKey, descriptor) {
        const valueType = typeof value;
        const result = { name, isArg: true, type: value.name };
        if (valueType === "string" || valueType === "number" || valueType === "boolean")
            result.type = valueType;
        target[exports.sSym].push(result);
    };
}
exports.arg = arg;
