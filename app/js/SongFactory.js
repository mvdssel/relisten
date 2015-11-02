'use strict';

var request = require('request'),
    util    = require('util');

var baseUrl = 'https://relisten.be/playlists';

// Regex's used to extract song inforamtion
var titleRegexp = new RegExp('itemprop="name">([^<]+)</span>', 'g'),
    artistRegexp = new RegExp('itemprop="byArtist">([^<]+)</span>', 'g'),
    playtimeRegexp = new RegExp('class="pull-right">(\\d\\d):(\\d\\d)</small>', 'g');

var SongFactory = {
    /**
     * Extracts all songs played on one station on a single date.
     * @param {string} station The identifier of the station.
     * @param {Date} date The date the songs are played.
     * @param {callback} The callback to pass the songs (or error) to.
     */
    getSongs: function(station, date, callback) {
        var url = generateUrl(station, date);

        request(url, function(error, request, body) {
            if(error) {
                callback(error);
            }
            else {
                var songs = extractSongs(station, date, body);
                callback(null, songs);
            }
        });
    },
};

/**
 * Generates the url to the songs of a station played on a specific date.
 * @param {string} station The identifier of the station.
 * @param {Date} date The date the songs are played.
 */
function generateUrl(station, date) {
    var formattedDate = util.format('%s-%s-%s', date.getDate(), 1 + date.getMonth(), date.getFullYear());
    var url = util.format('%s/%s/%s.html', baseUrl, station, formattedDate);
    return url;
}

/**
 * Extracts all song information from an html page and
 * returns it as an array of songs.
 * @param {string} station The identifier of the station is
 * included in all songs.
 * @param {Date} date The date the songs are played, used to
 * generate the datetime a song is played.
 * @param {string} body The html contents of the webpage.
 * @return {Array} An array of songs.
 */
function extractSongs(station, date, body) {
    // Reset the RegExp-objects using a global flag
    titleRegexp.lastIndex = artistRegexp.lastIndex = playtimeRegexp.lastIndex = 0;

    var songs = [],
        titleMatch, artistMatch, playtimeMatch;

    // While we can still find song information
    while( (titleMatch = titleRegexp.exec(body)) !== null &&
           (artistMatch = artistRegexp.exec(body)) !== null &&
           (playtimeMatch = playtimeRegexp.exec(body)) !== null
    ) {
        // Create the datetime based on the date and time
        var playtime = new Date(date);
        playtime.setHours(playtimeMatch[1]);
        playtime.setMinutes(playtimeMatch[2]);

        // Create a song object
        songs.push({
            station: station,
            title: titleMatch[1],
            artist: artistMatch[1],
            playtime: playtime
        });
    }

    return songs;
}

module.exports = SongFactory;
