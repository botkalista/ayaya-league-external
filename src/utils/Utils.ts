import { allowedChars } from "../consts/Offsets";



export function getNameFromBuffer(buffer): string {
    const _name: any[] = [];
    for (let i = 0; i < buffer.length; i++) {
        const s = String.fromCharCode(buffer.at(i))
        if (!allowedChars.includes(s)) break;
        _name.push(s);
    }
    const name = _name.join('');
    return name;
}