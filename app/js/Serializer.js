'use strict';

var Serializer = {
    serialize: function(playlists) {
        var flattenedPlaylists = flattenPlaylists(playlists);
        var csv = toCsv(flattenedPlaylists, '"', ';');
        return csv;
    }
};

function flattenPlaylists(playlists) {
    var flattenedPlaylists = [];

    for(var stationName in playlists) {
        if(playlists.hasOwnProperty(stationName)) {

            var stationDates = playlists[stationName];
            for(var date in stationDates) {
                if(stationDates.hasOwnProperty(date)) {

                    var songs = stationDates[date];
                    songs.forEach(flattenSong, {
                        flattenedPlaylists: flattenedPlaylists,
                        station: stationName,
                        date: date,
                    });

                }
            }

        }
    }

    return flattenedPlaylists;
}

function flattenSong(song) {
    /*jshint validthis:true */

    var flattenedSong = {
        station: this.station,
        date: this.date,
        title: song.title,
        artist: song.artist,
        playtime: song.playtime
    };

    this.flattenedPlaylists.push(flattenedSong);
}

// Source: https://gist.github.com/JeffJacobson/2770509
/**
 * Converts a value to a string appropriate for entry into a CSV table.  E.g., a string value will be surrounded by quotes.
 * @param {string|number|object} theValue
 * @param {string} sDelimiter The string delimiter.  Defaults to a double quote (") if omitted.
 */
function toCsvValue(theValue, sDelimiter) {
    var t = typeof (theValue), output;

    if (typeof (sDelimiter) === "undefined" || sDelimiter === null) {
        sDelimiter = '"';
    }

    if (t === "undefined" || t === null) {
        output = "";
    } else if (t === "string") {
        output = sDelimiter + theValue + sDelimiter;
    } else {
        output = String(theValue);
    }

    return output;
}

/**
 * Converts an array of objects (with identical schemas) into a CSV table.
 * @param {Array} objArray An array of objects.  Each object in the array must have the same property list.
 * @param {string} sDelimiter The string delimiter.  Defaults to a double quote (") if omitted.
 * @param {string} cDelimiter The column delimiter.  Defaults to a comma (,) if omitted.
 * @return {string} The CSV equivalent of objArray.
 */
function toCsv(objArray, sDelimiter, cDelimiter) {
    var i, l, names = [], name, value, obj, row, output = "", n, nl;

    // Initialize default parameters.
    if (typeof (sDelimiter) === "undefined" || sDelimiter === null) {
        sDelimiter = '"';
    }
    if (typeof (cDelimiter) === "undefined" || cDelimiter === null) {
        cDelimiter = ",";
    }

    for (i = 0, l = objArray.length; i < l; i += 1) {
        // Get the names of the properties.
        obj = objArray[i];
        row = "";
        if (i === 0) {
            // Loop through the names
            for (name in obj) {
                if (obj.hasOwnProperty(name)) {
                    names.push(name);
                    row += [sDelimiter, name, sDelimiter, cDelimiter].join("");
                }
            }
            row = row.substring(0, row.length - 1);
            output += row;
        }

        output += "\n";
        row = "";
        for (n = 0, nl = names.length; n < nl; n += 1) {
            name = names[n];
            value = obj[name];
            if (n > 0) {
                // row += ",";
                row += cDelimiter;
            }
            // row += toCsvValue(value, '"');
            row += toCsvValue(value, sDelimiter);
        }
        output += row;
    }

    return output;
}

module.exports = Serializer;
