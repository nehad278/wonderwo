'use strict';

process.stdin.resume();
process.stdin.setEncoding('utf-8');
let inputLine = '';
let currentLine = 0;

process.stdin.on('data', inputStdin => {
    inputLine += inputStdin;
});

process.stdin.on('end', _ => {
    inputLine = inputLine.trim().split('\n').map( str => {return str.trim();});
    main();
});

function readLine() {
    return inputLine[currentLine++];

}
function printData(str) {
    console.log(" Hello world " + inputString)
}
function main() {
    const n = +(readLine()); // it will return the first number
    const str = readLine();
    printData(str);
}