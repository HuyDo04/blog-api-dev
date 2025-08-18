const fs = require("fs").promises;

async function readJsonFile(filePath) {
    try {
        const data = await fs.readFile(filePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading JSON file:", error);
        throw error;
    }
}

async function writeJsonFile(filePath, data) {
    try {
        const jsonString = JSON.stringify(data, null, 2);
        await fs.writeFile(filePath, jsonString, "utf8");
    } catch (error) {
        console.error("Error writing JSON file:", error);
        throw error;
    }
}

module.exports = { readJsonFile, writeJsonFile };