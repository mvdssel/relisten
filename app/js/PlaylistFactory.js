'use strict';

var async = require('async'),
    util = require('util'),
    StationFactory = require('./StationFactory'),
    SongFactory = require('./SongFactory'),
    DateFactory = require('./DateFactory');

var PlaylistFactory = {
    /**
     * Get all songs played between two dates (incl.) from all radio stations.
     * @param {Date} startDate
     * @param {Date} endDate
     * @param {Function} callback The function to be called when all songs are
     * fetched or an error has occurred.
     */
    getPlaylists: function(startDate, endDate, callback) {
        var playlists = [];

        var dates = DateFactory.getDates(startDate, endDate);

        /**
         * Runs an array of functions in series, each passing their results
         * to the next in the array. 
         */
        async.waterfall([
                // First: get all stations
                StationFactory.getStations,
                function(stations, finishedPlaylists) {
                    // For each station
                    async.eachSeries(stations, function(station, finishedStation) {
                        // For each date (only 10 simultaneous fetches)
                        async.eachLimit(dates, 10, function(date, finishedDate) {
                            // Fetch the songs played on that date for that station
                            SongFactory.getSongs(station, date, function(error, songs) {
                                if(error) {
                                    console.error(util.format('Error while fetching songs from %s (%s): ', station, formatDate(date)), error);
                                    finishedDate(error);
                                }
                                else {
                                    console.log(util.format('Fetched %s songs for %s (%s)', songs.length, station, formatDate(date)));
                                    playlists.push.apply(playlists, songs);
                                    finishedDate(); // finished fetching songs for that date 
                                }
                            });
                        }, finishedStation); // finished fetching songs for all dates for that station
                    }, finishedPlaylists); // finished fetching songs for all stations
                },
        ],
        // Called when everything is fetched
        function(error) {
            if(error) {
                console.error('Error while fetching playlists: ', error);
                callback(error);
            }
            else {
                console.log('Successfully fetched all playlists!');
                callback(null, playlists); // Return the playlists to the provieded callback
            }
        });
    }
};

/**
 * Format a Date object into a readable string.
 * @param {Date} date The date to be formatted.
 * @return {string} A readable string representing date.
 */
function formatDate(date) {
    return util.format('%s-%s-%s', date.getDate(), 1 + date.getMonth(), date.getFullYear());
}

module.exports = PlaylistFactory;
