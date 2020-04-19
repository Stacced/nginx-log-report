// Dependencies
const { Parser } = require('@robojones/nginx-log-parser');
const helper = require('./functions.js');

// Constants
const nginxLogSchema = '$remote_addr - $remote_user [$time_local] "$request" $status $bytes_sent "$http_referer" "$http_user_agent"';
const logParser = new Parser(nginxLogSchema);

// Make sure program received a log file
if (process.argv.length < 4) {
    console.log('Usage: node app.js logfile.log GeoLiteCityDatabase.mmdb');
    process.exit(1);
}

// Read log file, process data and generate HTML file
(async () => {
    // Parse data from each line
    const linesData = [];
    const logLines = await helper.readLogFile(process.argv[2]);
    logLines.forEach(line => {
        try {
            const lineData = logParser.parseLine(line);
            linesData.push(lineData);
        } catch (error) {
            console.warn("[WARN] Couldn't process a line. Error message: " + error);
        }
    });

    // Geolocate IP
    const sourceIps = [];
    for (const lineData of linesData) {
        const ip = lineData.remote_addr;
        // Check if IP was already assigned a location
        if (sourceIps[ip] === undefined) {
            const ipData = await helper.getDataFromIp(ip);
            sourceIps[ip] = ipData;
        }
    }

    // Build HTML file
    helper.buildHtml(sourceIps, linesData);
})();
