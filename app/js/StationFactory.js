'use strict';

var request = require('request');

var homePage = 'https://relisten.be';
var regexp = new RegExp('data-stationurl="([^"]+)"', 'g');

var StationFactory = {
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

function extractStations(body) {
    var stations = [],
        match;

    while ((match = regexp.exec(body)) !== null) {
        stations.push(match[1]);
    }

    return stations;
}

module.exports = StationFactory;
