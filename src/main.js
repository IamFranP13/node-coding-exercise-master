const path = require('path');
const jsonRemover = require('./utils/jsonRemover');

async function main() {
    const inputPath = path.join(__dirname, '../data/mock_application.json');
    const outputPath = path.join(__dirname, '../data/clean_application.json');

    try {
        await jsonRemover.processJson(inputPath, outputPath);
    } catch (err) {
        console.error(err);
    }
}

main();
