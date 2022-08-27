
import * as mem from 'memoryjs';
import type { Process } from './models/mem/Process';

export class AyayaMemoryReader {
    private leagueProcess: Process;
    private baseAddress: number;
    private handle: number;
    private hooked = false;
    public memInstance = mem;

    get baseAddr() { return this.baseAddress; }
    get pHandle() { return this.handle; }

    hookLeagueProcess() {

        const processes: Process[] = mem.getProcesses();

        const league = processes.find(e => e.szExeFile == 'League of Legends.exe');
        if (!league) throw Error('League process not found');

        const pid = league.th32ProcessID;

        this.leagueProcess = mem.openProcess(pid);
        this.baseAddress = this.leagueProcess.modBaseAddr;
        this.handle = this.leagueProcess.handle;
        this.hooked = true;
    }

    readInt(address: number, fromBaseAddress: boolean = false): number {
        return this.readProcessMemory(address, "DWORD", fromBaseAddress)
    }
    readByte(address: number, fromBaseAddress: boolean = false): number {
        return this.readProcessMemory(address, "BYTE", fromBaseAddress)
    }
    readString(address: number, fromBaseAddress: boolean = false): string {
        return this.readProcessMemory(address, "STR", fromBaseAddress)
    }
    readVec(address: number, fromBaseAddress: boolean = false): { x: number, y: number, z: number } {
        return this.readProcessMemory(address, "VEC3", fromBaseAddress)
    }

    readProcessMemory(address: number, type: string, fromBaseAddress: boolean = false) {
        if (!this.hooked) throw Error('You need to hook league process before reading memory');
        if (type == 'STR' || type == 'STRING') {
            const chars = [];
            const buff = mem.readBuffer(this.handle, address + (fromBaseAddress ? this.baseAddress : 0), 50)
            for (let i = 0; i < buff.length; i++) {
                const target = buff.at(i);
                if (target == 0 && i > 0) break;
                chars.push(String.fromCharCode(target));
            }
            return chars.join('');
        }
        return mem.readMemory(this.handle, address + (fromBaseAddress ? this.baseAddress : 0), type);
    }

    readProcessMemoryBuffer(address: number, size: number, fromBaseAddress: boolean = false): Buffer {
        if (!this.hooked) throw Error('You need to hook league process before reading memory');
        return mem.readBuffer(this.handle, address + (fromBaseAddress ? this.baseAddress : 0), size);
    }

    callFunction(args, returnType, address) {
        return mem.callFunction(this.handle, args, returnType, address);
    }

    toHex(int: number) {
        return '0x' + int.toString(16).toUpperCase();
    }

}

const instance = new AyayaMemoryReader;

export default instance;
