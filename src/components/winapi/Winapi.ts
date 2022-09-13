import type { Process } from "./typings/Process";
import type { Module } from "./typings/Module";
import type { Callback } from "./typings/Callback";
import type { DataTypeBoolean, DataTypeNumber, DataTypeString, DataTypeVector3, DataTypeVector4 } from "./typings/enums/DataType";
import type { memVector3, memVector4 } from './typings/Vector';
import type { ProtectionType } from "./typings/enums/ProtectionType";
import type { SignatureType } from "./typings/enums/SignatureType";
import type { FunctionArg } from "./typings/FunctionArg";
import type { ReturnTypeBoolean, ReturnTypeNumber, ReturnTypeString, ReturnTypeVoid } from "./typings/enums/ReturnType";
import type { ReturnObject } from "./typings/ReturnObject";
import type { TriggerType } from "./typings/enums/TriggerType";

import { Vector2 } from '../../models/Vector';

import * as path from 'path';

const mem = require(path.join(__dirname, './cpp/memoryjs/memoryjs.node'));
const winapi = require(path.join(__dirname, './cpp/ayaya-winapi/build/Release/AyayaWinapiWrapper.node'));

class Winapi {
    get reader() { return reader; }
    get actions() { return actions; }
}

const reader = {
    openProcess,
    waitForClose,
    readMemory,
    readBuffer
}

const actions = {
    isPressed(key: number): boolean {
        return winapi.isKeyPressed(key);
    },
    press(key: number) {
        return winapi.pressKey(key);
    },
    release(key: number) {
        return winapi.releaseKey(key);
    },
    move(x: number, y: number) {
        return winapi.setMousePos(x, y);
    },
    click(x: number, y: number) {
        console.log('click not implemented');
    },
    getMousePos(): Vector2 {
        const [x, y] = winapi.getMousePos().split('_')
        return new Vector2(parseInt(x), parseInt(y));
    },
    blockInput(block: boolean): boolean {
        return winapi.blockInput(block);
    },
    sleepSync(ms: number) {
        const t = Date.now();
        while (Date.now() - t < ms) { }
    }

}

function waitForClose(pHandle: number, ms: number): number {
    return winapi.waitForClose(pHandle, ms);
};

function openProcess(name: string): Process {
    return mem.openProcess(name);
}


function readMemory<T>(handle: number, address: number, dataType: any): T {
    return mem.readMemory(handle, address, dataType);
}

function readBuffer(handle: number, address: number, size: number): Buffer {
    return mem.readBuffer(handle, address, size);
}


const instance = new Winapi();
export default instance;

declare function getProcesses(): Process[];
declare function getProcesses(callback: Callback<Process[]>): void;

declare function findModule(moduleName: string, pid: number): Module;
declare function findModule(moduleName: string, callback: Callback<Module[]>): void;

declare function getModules(pid: number): Module[];
declare function getModules(pid: number, callbacK: Callback<Module[]>): void;

declare function writeMemory(handle: number, address: number, value: number, dataType: DataTypeNumber): void;
declare function writeMemory(handle: number, address: number, value: string, dataType: DataTypeString): void;
declare function writeMemory(handle: number, address: number, value: boolean, dataType: DataTypeBoolean): void;
declare function writeMemory(handle: number, address: number, value: memVector3, dataType: DataTypeVector3): void;
declare function writeMemory(handle: number, address: number, value: memVector4, dataType: DataTypeVector4): void;

declare function writeBuffer(handle: number, address: number, buffer: Buffer): void;

declare function getRegions(handle: number): any;
declare function getRegions(handle: number, callback: Callback<any>): any;

declare function virtualProtectEx(handle: number, address: number, size: number, protection: ProtectionType): ProtectionType;

declare function findPattern(handle: number, moduleName: string, signature: any, signatureType?: SignatureType, patternOffset?: number, addressOffset?: number): number;
declare function findPattern(handle: number, moduleName: string, signature: any, signatureType: SignatureType, patternOffset: number, addressOffset: number, callback: Callback<number>): void;


declare function callFunction(handle: number, args: FunctionArg[], returnType: ReturnTypeBoolean, address: number): ReturnObject<boolean>;
declare function callFunction(handle: number, args: FunctionArg[], returnType: ReturnTypeNumber, address: number): ReturnObject<number>;
declare function callFunction(handle: number, args: FunctionArg[], returnType: ReturnTypeString, address: number): ReturnObject<string>;
declare function callFunction(handle: number, args: FunctionArg[], returnType: ReturnTypeVoid, address: number): ReturnObject<void>;

declare function callFunction(handle: number, args: FunctionArg[], returnType: ReturnTypeBoolean, address: number, callback: Callback<ReturnObject<boolean>>): void;
declare function callFunction(handle: number, args: FunctionArg[], returnType: ReturnTypeNumber, address: number, callback: Callback<ReturnObject<number>>): void;
declare function callFunction(handle: number, args: FunctionArg[], returnType: ReturnTypeString, address: number, callback: Callback<ReturnObject<string>>): void;
declare function callFunction(handle: number, args: FunctionArg[], returnType: ReturnTypeVoid, address: number, callback: Callback<ReturnObject<void>>): void;

declare function attackDebugger(pid: number, exitOnDetatch: boolean): any;
declare function detatchDebugger(pid: number): any;

declare function handleDebugEvent(pid: number, threadId: number);
declare function setHardwareBreakpoint(pid: number, address: number, hardwareRegister, trigger: TriggerType, length: number);

declare function removeHardwareBreakpoint(pid: number, hardwareRegister);
