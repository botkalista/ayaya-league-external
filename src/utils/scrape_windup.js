

const fs = require('fs');
const fetch = require('node-fetch');

fetch('https://leagueoflegends.fandom.com/wiki/List_of_champions/Basic_attacks').then(res => res.text()).then(data => {

    const tableStartIndex = data.indexOf('<table>');
    const tableEndIndex = data.indexOf('</table>');
    const tableData = data.substring(tableStartIndex, tableEndIndex);

    const rows = tableData.split('</tr>').splice(1);
    rows.splice(rows.length - 1);

    const result = rows.map(e => {
        const champName = e.match(/.*>(.*?)<\/a><\/span><\/span>/)[1];
        const windup = e.match(/.*<td>(.*?)%<\/td>/)[1];
        const modWindup = e.match(/.*<td>(.*?)<\/td>/)[1];
        return { champName, windup, modWindup }
    });

    fs.writeFileSync('../consts/ChampionsWindups.ts', `export const ChampionsWindups = ${JSON.stringify(result, null, 2)}`);

});

