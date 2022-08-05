import * as fs from 'fs';
import AyayaMemoryReader from '../MemoryReader';


//* Dump all process memory to test things without league open

AyayaMemoryReader.hookLeagueProcess();
const leagueModule = AyayaMemoryReader.leagueModule;
const baseAddress = leagueModule.modBaseAddr;
const size = leagueModule.modBaseSize;

if (fs.existsSync('dump/dump.hex')) fs.rmSync('dump/dump.hex');
if (fs.existsSync('dump/dump.info')) fs.rmSync('dump/dump.info');
const writeStream = fs.createWriteStream('dump/dump.hex', { flags: 'a', encoding: 'hex' });

const CHUNK_SIZE = 10000;
for (let i = 0; i < size * 20; i += CHUNK_SIZE) {
    const dump = AyayaMemoryReader.readProcessMemoryBuffer(baseAddress + i, CHUNK_SIZE, false);
    writeStream.write(dump);
}

fs.writeFileSync('../dump/dump.info', JSON.stringify({ baseAddress }));