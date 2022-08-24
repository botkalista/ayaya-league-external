"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readVTable = exports.readMatrix = exports.readMap = exports.readName = void 0;
const MemoryReader_1 = require("./MemoryReader");
const math = require("mathjs");
function readName(address, forceFirstAddress = false, forceSecondAddress = false) {
    try {
        const length = MemoryReader_1.default.readProcessMemory(address + 0x10, 'DWORD');
        if (!forceSecondAddress) {
            if ((length < 16 && length > 0) || forceFirstAddress)
                return MemoryReader_1.default.readProcessMemory(address, 'STR');
        }
        const nameAddress = MemoryReader_1.default.readProcessMemory(address, 'DWORD');
        const name = MemoryReader_1.default.readProcessMemory(nameAddress, 'STR');
        if (name.startsWith(' ') || name.length == 0) {
            console.log('ERROR READING NAME AT', address);
        }
        return name;
    }
    catch (ex) {
        return "__NO_NAME__";
    }
}
exports.readName = readName;
function readMap(rootNode, size) {
    const checked = new Set();
    const toCheck = new Set();
    toCheck.add(rootNode);
    while (toCheck.size > 0) {
        const target = Array.from(toCheck.values())[0];
        checked.add(target);
        toCheck.delete(target);
        const nextObject1 = MemoryReader_1.default.readProcessMemory(target + 0x0, "DWORD");
        if (!checked.has(nextObject1))
            toCheck.add(nextObject1);
        if (size && checked.size >= size)
            break;
        const nextObject2 = MemoryReader_1.default.readProcessMemory(target + 0x4, "DWORD");
        if (!checked.has(nextObject2))
            toCheck.add(nextObject2);
        if (size && checked.size >= size)
            break;
        const nextObject3 = MemoryReader_1.default.readProcessMemory(target + 0x8, "DWORD");
        if (!checked.has(nextObject3))
            toCheck.add(nextObject3);
        if (size && checked.size >= size)
            break;
    }
    return Array.from(checked.values());
}
exports.readMap = readMap;
function readMatrix(address) {
    const buffer = MemoryReader_1.default.readProcessMemoryBuffer(address, 64, true);
    const matrix = math.matrix([
        [
            buffer.readFloatLE(0 * 4), buffer.readFloatLE(1 * 4),
            buffer.readFloatLE(2 * 4), buffer.readFloatLE(3 * 4)
        ],
        [
            buffer.readFloatLE(4 * 4), buffer.readFloatLE(5 * 4),
            buffer.readFloatLE(6 * 4), buffer.readFloatLE(7 * 4)
        ],
        [
            buffer.readFloatLE(8 * 4), buffer.readFloatLE(9 * 4),
            buffer.readFloatLE(10 * 4), buffer.readFloatLE(11 * 4)
        ],
        [
            buffer.readFloatLE(12 * 4), buffer.readFloatLE(13 * 4),
            buffer.readFloatLE(14 * 4), buffer.readFloatLE(15 * 4)
        ]
    ]);
    return matrix;
}
exports.readMatrix = readMatrix;
function readVTable(address) {
    const result = [];
    const list = MemoryReader_1.default.readProcessMemory(address + 0x4, "DWORD");
    const size = MemoryReader_1.default.readProcessMemory(address + 0x8, "DWORD");
    for (let i = 0; i < size; i++) {
        result.push(MemoryReader_1.default.readProcessMemory(list + (i * 0x4), "DWORD"));
    }
    return result;
}
exports.readVTable = readVTable;
