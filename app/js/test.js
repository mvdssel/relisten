// 'use strict';
//
// var util = require('util');
// var fs = require('fs');
// var async = require('async');
// var SongFactory = require('./SongFactory');
// var DateFactory = require('./DateFactory');
// var Serializer = require('./Serializer');
//
// var filename = './test.csv';
// var station = 'radio2';
// var dates = DateFactory.getDates(new Date('2015-10-10'), new Date('2015-10-11'));
//
// var playlist = {};
// playlist[station] = {};
//
// async.eachSeries(dates, function(date, callback) {
//     SongFactory.getSongs(station, date, function(error, songs) {
//         if(error) {
//             console.log("Error: ", error);
//         }
//
//         console.log('fetched ' + songs.length + ' songs for ' + formatDate(date));
//         playlist[station][date] = songs;
//         callback();
//     });
// }, function(error) {
//     if(error) {
//         console.log("Error: ", error);
//     }
//
//     var csvData = Serializer.serialize(playlist);
//     fs.writeFile(filename, csvData, function(error) {
//         if(error) {
//             return console.error('Error: ', error);
//         }
//
//         console.log('Saved results at ' + filename);
//     }); 
// });
//
// function formatDate(date) {
//     return util.format('%s-%s-%s', date.getDate(), 1 + date.getMonth(), date.getFullYear());
// }
