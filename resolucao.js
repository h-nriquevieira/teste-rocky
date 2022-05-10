const fs = require('fs'); 
// Utilização do módulo fs retirada do link: https://stackabuse.com/reading-and-writing-json-files-with-node-js/
let database;

function readJSON() {
    console.log(`Obtendo banco de dados corrompido do arquivo 'broken-database.json`);
    const raw = fs.readFileSync('./broken-database.json');
    database = JSON.parse(raw);
    console.log('Banco de dados obtido.');
}

/* ==============================
   Correção dos dados corrompidos
   ============================== */

function fixName(input) {
    console.log('Iniciando correção de nomes...')
    for (let i = 0; i < input.length; i++) {
        input[i].name = input[i].name.replace(/æ/g, 'a')
                                     .replace(/¢/g, 'c')
                                     .replace(/ø/g, 'o')
                                     .replace(/ß/g, 'b');
    }
    console.log('Correção de nomes finalizada com sucesso!');
}

function fixPrice(input) {
    console.log('Iniciando correção de preços...');
    for (let i = 0; i < input.length; i++) {
        input[i].price = parseFloat(input[i].price);
    }
    console.log('Correção de preços finalizada com sucesso!');
}

function fixQuantity(input) {
    console.log('Iniciando correção de quantidade...');
    for (let i = 0; i < input.length; i++) {
        if (!input[i].quantity) {
            input[i].quantity = 0;
        }
    }
    console.log('Correção de quantidade finalizada com sucesso!');
}

function writeJSON(input) {
    console.log('Gravando o arquivo saida.json com o banco de dados corrigindo...')
    const jsonString = JSON.stringify(input);
    fs.writeFileSync('./saida.json', jsonString);
    console.log('Gravação finalizada.');
}

/* =======================
   Validação das correções
   ======================= */


// Na função abaixo, utilizei como base o código presente no link: https://www.codegrepper.com/code-examples/typescript/javascript+sort+json+array+by+multiple+values
function sortJSON(input) {
    console.log('Banco de dados ordenado por categoria e ID:');
    console.table(input.sort(function(a, b) {          
        if (a.category === b.category) {
           return a.id - b.id;
        }
        return a.category > b.category ? 1 : -1;
     }))
}

function sumPrice(input) {
    console.log('Soma dos valores de cada categoria, considerando a quantidade de cada item:');
    let sum = {};
    for (let i = 0; i < input.length; i++) {
        if (sum[input[i].category]) {
            sum[input[i].category] += input[i].price * input[i].quantity;
        } else {
            sum[input[i].category] = input[i].price * input[i].quantity;
        }
    }
    console.table(sum);
}

function run() {
    readJSON();
    fixName(database);
    fixPrice(database);
    fixQuantity(database);
    writeJSON(database);
    sortJSON(database);
    sumPrice(database);
}

run();