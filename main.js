const fs = require('fs');
const path = require('path');

function decodeValue(value, base) {
    return parseInt(value, base);
}
function calculateSecret(points) {
    const k = points.length; // Number of points
    let secret = 0;

    // Lagrange interpolation
    for (let i = 0; i < k; i++) {
        let xi = points[i][0];
        let yi = points[i][1];
        let term = yi;

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = points[j][0];
                term *= (0 - xj) / (xi - xj);
            }
        }
        secret += term;
    }

    return secret;
}

function processInput(fileName) {
    const input = JSON.parse(fs.readFileSync(path.join(__dirname, fileName), 'utf-8'));

    const n = input.keys.n;
    const k = input.keys.k;

    if (k > n) {
        console.log(`Not enough roots to calculate c for ${fileName}.`);
        return;
    }

    const points = [];
    for (let i = 1; i <= n; i++) {
        if (input[i.toString()]) {
            const base = parseInt(input[i.toString()].base);
            const value = input[i.toString()].value;
            const decodedValue = decodeValue(value, base);
            points.push([i, decodedValue]);
        }
    }
    if (points.length < k) {
        console.log(`Not enough roots to calculate c for ${fileName}.`);
        return;
    }

    const secret = calculateSecret(points.slice(0, k));
    console.log(`The constant term c for ${fileName} is:`, secret);
}

function main() {
    processInput('input.json');
    processInput('input2.json');
}

main();
