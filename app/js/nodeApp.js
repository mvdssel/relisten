'use strict';

var fs = require('fs');
var PlaylistFactory = require('./PlaylistFactory');
var Serializer = require('./Serializer');

var filename = './playlists.csv';
var stopDate = new Date(); // end = today
var startDate = new Date(stopDate.getFullYear(), stopDate.getMonth(), 1); // end = first day of the current month

PlaylistFactory.getPlaylists(startDate, stopDate, handlePlaylists);
// PlaylistFactory.getPlaylists(stopDate, stopDate, handlePlaylists);

/**
 * Method to be called when all playlists are fetched. Serializes
 * the playlists to CSV data and saves the data to the filesystem.
 * @param {Error} error Possible error, null if none occurred.
 * @param {Array} playlists Array of songs.
 */
function handlePlaylists(error, playlists) {
    if(error) {
        console.error('Error while fetching playlists: ', error);
    }
    else {
        var csvData = Serializer.serialize(playlists);
        fs.writeFile(filename, csvData, function(error) {
            if(error) {
                return console.error('Error while writing to filesystem: ', error);
            }

            console.log('The file was saved at ' + filename);
        }); 
    }
}
