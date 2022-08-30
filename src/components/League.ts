
import type { Process } from './winapi/typings/Process';

import { DataType } from './winapi/typings/enums/DataType';
import Offsets from './Offsets';

import winapi from './winapi/Winapi'


class League {

    private process: Process;

    read<T>(address: number, type: DataType, fromBase = false): T {
        if (!this.process) return;
        return winapi.reader
            .readMemory(this.process.handle,
                address + (fromBase ? this.process.modBaseAddr : 0),
                type as any
            );
    }

    readBuffer(address: number, size: number, fromBase = false) {
        if (!this.process) return;
        return winapi.reader.readBuffer(this.process.handle,
            address + (fromBase ? this.process.modBaseAddr : 0),
            size);
    }

    isOpen() {
        return this.process != undefined;
    }

    openLeagueProcess() {
        this.process = winapi.reader.openProcess('League of Legends.exe');
    }

    closeLeagueProcess() {
        this.process = undefined;
    }


}

const league = new League();
export default league;