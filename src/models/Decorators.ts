
export const sSym = Symbol("docs");

type DocsClass = { [sSym]?: any[] }

export function classDocs(value?: string) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            constructor(...args) {
                super(...args);
                const result = { isClass: true, value: value || constructor.name }
                this[sSym].push(result);
            }
        };
    }
}

export function desc(value: string) {
    return function <T>(target: T & DocsClass, propertyKey: string, descriptor: PropertyDescriptor) {
        const result = { desc: value, name: propertyKey, isMethod: true }
        target[sSym].push(result);
    }
}

export function res(value: any) {
    return function <T>(target: T & DocsClass, propertyKey: string, descriptor: PropertyDescriptor) {
        const valueType = typeof value;
        const result = { isRet: true, type: value.name };
        if (valueType === "string" || valueType === "number" || valueType === "boolean") result.type = valueType;
        target[sSym] = target[sSym] || [];
        target[sSym].push(result);
    }
}


export function arg(name: string, value: any) {
    return function <T>(target: T & DocsClass, propertyKey: string, descriptor: PropertyDescriptor) {
        const valueType = typeof value;
        const result = { name, isArg: true, type: value.name };
        if (valueType === "string" || valueType === "number" || valueType === "boolean") result.type = valueType;
        target[sSym].push(result);
    }
}