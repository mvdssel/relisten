'use strict';

var request = require('request');

var homePage = 'https://relisten.be';
var stationIdentifierRegexp = new RegExp('data-stationurl="([^"]+)"', 'g');

var StationFactory = {
    /**
     * Get the identifiers of all radio stations.
     * @param {Function} callback The function to be called when
     * all stations are fetched or an error occurred.
     * @return {Array} an array of string identifiers of stations
     */
    getStations: function(callback) {
        request(homePage, function(error, request, body) {
            if(error) {
                callback(error);
            }
            else {
                var stations = extractStations(body);
                callback(null, stations);
            }
        });
    },
};

/**
 * Extracts all station identifiers from an html page.
 * @param {string} body The html contents of the webpage.
 * @return {Array} An array of string identifiers.
 */
function extractStations(body) {
    // Reset the RegExp-objects using a global flag
    stationIdentifierRegexp.lastIndex = 0;

    var stations = [],
        match;

    // While we can still find station information
    while ((match = stationIdentifierRegexp.exec(body)) !== null) {
        stations.push(match[1]);
    }

    return stations;
}

module.exports = StationFactory;
