
import { Vector2, Vector3 } from '../src/models/Vector';

import { sSym } from '../src/models/Decorators'

type DocArg = { name: string, type: string, isArg: true }
type MethodArg = { desc: string, name: string, isStatic: boolean, isMethod: true, args: DocArg[], ret: string }
type ClassArg = { className: string, methods: MethodArg[] }


const classesToAnalyze = [
    new Vector2(0, 0),
    new Vector3(0, 0, 0),
]


function typeDoc(type: string) {
    return `[\`${type}\`](#${type.replace(/(\s)/g, '-').toLowerCase()})`;
}

function read_docs(arr: any[], cData?: ClassArg) {
    const classData: ClassArg = { className: cData?.className || arr[0].value, methods: [] }
    for (let i = cData ? 0 : 1; i < arr.length; i++) {

        let method: MethodArg = {
            args: [], desc: '', isMethod: true,
            isStatic: false, name: '', ret: ''
        }

        if ((arr[i] as MethodArg).isMethod) method = arr[i++];

        method.isStatic = cData != undefined

        method.args = [];
        while (arr[i] && arr[i].isArg) method.args.push(arr[i++]);
        while (arr[i] && arr[i].isRet) method.ret = (arr[i++].type);
        (cData || classData).methods.push(method);
        i--
    }
    return classData;
}

for (let k = 0; k < classesToAnalyze.length; k++) {

    const docs: any[] = classesToAnalyze[k][sSym].reverse();
    const docsStatic: any[] = classesToAnalyze[k].constructor[sSym].reverse();


    const classData = read_docs(docs);
    read_docs(docsStatic, classData);

    const methodsResults = classData.methods.map(m => {
        const argsResult = m.args.map(a => `${a.name}: ${typeDoc(a.type)}`).join(', ');
        const argStr = argsResult.length == 0 ? '():' : `(${argsResult}):`;
        return `- ${m.isStatic ? '\`static\` ' : ''}*${m.name}*${argStr} ${typeDoc(m.ret)} - ${m.desc}`
    }).join('\n\n');

    const result = `## ${classData.className}\n\n**properties**\n\n**methods**\n\n${methodsResults}`;

    console.log(result);
}



