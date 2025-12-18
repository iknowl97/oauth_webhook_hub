const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '../Source');
const DEST_DIR = path.join(__dirname, '../Processed');
const LOG_FILE = path.join(__dirname, '../resource_processing.log');

// Naming Convention: [ProjectID]_[ResourceType]_[YYYYMMDD]_[Version].ext
// Example: oauthhub_logo_20251219_v1.png
const NAMING_REGEX = /^[a-z0-9]+_[a-z0-9]+_\d{8}_v\d+\.[a-z0-9]+$/;

async function processResources() {
    if (!fs.existsSync(SOURCE_DIR)) fs.mkdirSync(SOURCE_DIR);
    if (!fs.existsSync(DEST_DIR)) fs.mkdirSync(DEST_DIR);

    const files = fs.readdirSync(SOURCE_DIR);
    let logEntry = `[${new Date().toISOString()}] Processing ${files.length} files\n`;
    console.log(`Scanning ${SOURCE_DIR}...`);

    for (const file of files) {
        if (file.startsWith('.')) continue; // Skip hidden

        const isValid = NAMING_REGEX.test(file);
        if (!isValid) {
            const error = `[INVALID] ${file} does not match [ProjectID]_[ResourceType]_[YYYYMMDD]_[Version].ext`;
            console.error(error);
            logEntry += `${error}\n`;
            continue;
        }

        const srcPath = path.join(SOURCE_DIR, file);
        const destPath = path.join(DEST_DIR, file);

        // Copy and preserve metadata (mode/timestamps)
        fs.copyFileSync(srcPath, destPath, fs.constants.COPYFILE_FICLONE);
        const stats = fs.statSync(srcPath);
        fs.utimesSync(destPath, stats.atime, stats.mtime);

        const success = `[SUCCESS] Processed ${file}`;
        console.log(success);
        logEntry += `${success}\n`;
    }

    fs.appendFileSync(LOG_FILE, logEntry);
    console.log('Processing complete. Log updated.');
}

processResources().catch(console.error);
