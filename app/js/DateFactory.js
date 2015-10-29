'use strict';

var DateFactory = {
    getDates: function(from, to) {
        var dates = [new Date(from)],
            current = new Date(from);
        
        while(current < to) {
            current.setDate(current.getDate() + 1);
            dates.push(new Date(current));
        }

        return dates;
    }
};

module.exports = DateFactory;
