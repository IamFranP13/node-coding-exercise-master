const fs = require('fs');
const util = require('util');
const path = require('path');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'json-remover' },
    transports: [
        new winston.transports.File({ filename: path.join(__dirname, '../../logs/error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.join(__dirname, '../../logs/combined.log') })
    ]
});

async function readJsonFile(filePath) {
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data);
}

async function writeJsonFile(filePath, data) {
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function removeDuplicateFields(object) {
    const seenKeys = new Set();
    object.fields = object.fields.filter(field => {
        const duplicate = seenKeys.has(field._id) || seenKeys.has(field.name) || seenKeys.has(field.key);
        seenKeys.add(field._id);
        seenKeys.add(field.name);
        seenKeys.add(field.key);
        if (duplicate) {
            logger.info(`Duplicate field with id ${field._id} removed from object with id ${object._id}.`);
        }
        return !duplicate;
    });
    return object;
}

function removeDuplicateObjects(version) {
    const seenIds = new Set();
    version.objects = version.objects.map(removeDuplicateFields);
    version.objects = version.objects.filter(object => {
        const duplicate = seenIds.has(object._id) || seenIds.has(object.name);
        seenIds.add(object._id);
        seenIds.add(object.name);
        if (duplicate) {
            logger.info(`Duplicate object with id ${object._id} removed.`);
        }
        return !duplicate;
    });
    return version;
}

async function processJson(inputPath, outputPath) {
    const data = await readJsonFile(inputPath);
    data.versions = data.versions.map(removeDuplicateObjects);
    await writeJsonFile(outputPath, data);
    logger.info('JSON file without duplicates saved in the data folder.');
}

module.exports = {
    readJsonFile,
    writeJsonFile,
    removeDuplicateFields,
    removeDuplicateObjects,
    processJson
};
