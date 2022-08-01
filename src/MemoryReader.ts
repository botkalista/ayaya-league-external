
import * as mem from 'memoryjs';


export class AyayaMemoryReader {

    private leagueProcess;
    private baseAddress;
    private handle;
    public hooked = false;

    public memInstance = mem;

    get baseAddr() { return this.baseAddress; }
    get pHandle() { return this.handle; }

    hookLeagueProcess() {
        const processes = mem.getProcesses();
        const league = processes.find(e => e.szExeFile == 'League of Legends.exe');
        if (!league) throw Error('League process not found');
        const pid = league.th32ProcessID;
        this.leagueProcess = mem.openProcess(pid);
        this.baseAddress = this.leagueProcess.modBaseAddr;
        this.handle = this.leagueProcess.handle;
        this.hooked = true;
    }

    readProcessMemory(address: number, type: string, fromBaseAddress: boolean = false) {
        if (!this.hooked) throw Error('You need to hook league process before reading memory');
        return mem.readMemory(this.handle, address + (fromBaseAddress ? this.baseAddress : 0), type);
    }

    readProcessMemoryBuffer(address: number, size: number, fromBaseAddress: boolean = false) {
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
