// Dependencies
const Reader = require('@maxmind/geoip2-node').Reader;
const fsPromises = require('fs').promises;
const fetch = require('node-fetch');
const { format:printf } = require('util');
const { JSDOM } = require('jsdom');

// Constants
global.DOMParser = new JSDOM().window.DOMParser;
//const ipgeolocationApiKey = '216ac531b0ee4d28a76884090cc9e6fb';
//const ipgeolocationEndpoint = 'https://freegeoip.app/json/%s';

/**
 * Returns lines of log file at path
 * @param path
 */
async function readLogFile(path) {
    const data = await fsPromises.readFile(path, 'utf8');
    return data.split(/[\r\n]+/);
}

/**
 * Builds HTML report file with source IPs
 * @param {array} sourceIps
 * @param {array} linesData
 */
function buildHtml(sourceIps, linesData) {
    // Get template content as string
    fsPromises.readFile('template.html', 'utf8')
        .then(html => {
            // Constants / vars
            const parser = new DOMParser();

            // Parse string to HTML document
            const doc = parser.parseFromString(html, 'text/html');
            const script = doc.createElement('script');
            let scriptHtml = '';

            // Create markers for map
            let markerCount = 0;
            const markerStr = 'const marker%s = L.marker([%s, %s]).addTo(map);\r\n';
            const markerPopupStr = 'marker%s.bindPopup("%s").openPopup()\r\n';
            for (const ip in sourceIps) {
                markerCount++;
                scriptHtml += printf(markerStr, markerCount, sourceIps[ip].latitude, sourceIps[ip].longitude);
                scriptHtml += printf(markerPopupStr, markerCount, ip);
            }
            
            // Define script HTML
            script.innerHTML = scriptHtml;

            // Append script to HTML element
            doc.getElementsByTagName('html')[0].append(script);

            // Append countries to table
            const countriesTable = doc.getElementById('countries');
            const countries = computeCountriesAccessCount(sourceIps);

            for (const country in countries) {
                const countryRow = doc.createElement('tr');
                countryRow.innerHTML = `
                <td>${country}</td><td>${countries[country]}</td>
                `;
                countriesTable.appendChild(countryRow);
            }

            // Append accessed pages to table
            const accessedTable = doc.getElementById('successful');
            const accessedPages = computeAccessedPages(linesData);

            accessedPages.forEach(accessed => {
                const accessedRow = doc.createElement('tr');
                accessedRow.innerHTML = `
                <td>${accessed.ip}</td><td>${accessed.page}</td><td>${accessed.ua}</td>
                `;
                accessedTable.appendChild(accessedRow);
            });

            // Write HTML to report file
            fsPromises.writeFile('report.html', '<html lang="en">' + doc.documentElement.innerHTML + '</html>');
        })
        .catch(console.error);
}

/**
 * Returns IP data object with latitude, longitude and country name
 * @param ip
 * @returns {Promise<{country: string, latitude: number, longitude: number}|undefined>}
 */
async function getDataFromIp(ip) {
    const reader = await Reader.open(process.argv[3], {});
    try {
        return {
            latitude: reader.city(ip).location.latitude,
            longitude: reader.city(ip).location.longitude,
            country: reader.city(ip).country.names.fr
        }
    } catch (error) {
        return undefined;
    }
}

/**
 * Returns access count for each countries
 * @param sourceIps
 * @returns {[]}
 */
function computeCountriesAccessCount(sourceIps) {
    // Compute countries count
    const countriesAccessCount = [];
    for (const ip in sourceIps) {
        const ipCountry = sourceIps[ip].country;
        if (countriesAccessCount[ipCountry] !== undefined) {
            countriesAccessCount[ipCountry]++;
        } else {
            countriesAccessCount[ipCountry] = 1;
        }
    }

    return countriesAccessCount;
}

/**
 * Returns an array containing accessed pages as plain objects with ip, page and user-agent
 * @param {[]} linesData
 * @returns {[]}
 */
function computeAccessedPages(linesData) {
    // Compute accessed pages
    const accessedPages = [];
    linesData.forEach(lineData => {
        if (lineData.status === '200') {
            accessedPages.push({
                ip: lineData.remote_addr,
                page: lineData.request,
                ua: lineData.http_user_agent
            });
        }
    });

    return accessedPages;
}


module.exports = { readLogFile, buildHtml, getDataFromIp };