'use strict';

var $ = require('jquery');
var PlaylistFactory = require('./PlaylistFactory');
var Serializer = require('./Serializer');
// Require for picker libs is needed in order to include them in the packaged version of the app
var picker = require('../../node_modules/pickadate/lib/compressed/picker.js');
var pickerdate = require('../../node_modules/pickadate/lib/compressed/picker.date.js');

// Start when page is fully loaded
$(document).ready(function() {

/**
 * Initialize pickers
 */
var pickerOptions = {
    format: 'yyyy-mm-dd', // needed for parsing to dates
    firstDay: 1, // first day of week = monday
    max: true, // max = today
};

var $startDate = $('#start-date').pickadate(pickerOptions);
var $endDate = $('#end-date').pickadate(pickerOptions);

var startDatePicker = $startDate.pickadate('picker');
var endDatePicker = $endDate.pickadate('picker');

/**
 * Initalize button
 */
var button = $("#download-button"); 
button.click(function() {
    var startDate = new Date(startDatePicker.get());
    var endDate = new Date(endDatePicker.get());

    if(startDate instanceof Date && endDate instanceof Date &&
       !isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) &&
       startDate <= endDate
    ) {
        PlaylistFactory.getPlaylists(startDate, endDate, handlePlaylists);
        $(document.body).append($('<p>').text("Downloading playlists, this may take a while..."));
    }
    else {
        console.log("Invalid dates selected...");
        alert('Invalid dates selected...');
    }
});

/**
 * Method to be called when all playlists are fetched. Serializes
 * the playlists to CSV data and downloads the data in the browser.
 * @param {Error} error Possible error, null if none occurred.
 * @param {Array} playlists Array of songs.
 */
function handlePlaylists(error, playlists) {
    if(error) {
        console.error('Error while fetching playlists: ', error);
        alert('Error while fetching playlists: ' + error.message);
    }
    else {
        var csvData = Serializer.serialize(playlists);
        document.location = 'data:text/csv;charset=utf-8,' + 
                            encodeURIComponent(csvData);
    }
}

}); // end of file
