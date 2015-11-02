'use strict';

var DateFactory = {
    /**
     * Generates all dates between two provided dates
     * and returns them as an array (arguments included).
     */
    getDates: function(from, to) {
        var dates = [new Date(from)],
            d = new Date(from);
        
        while(d < to) {
            d.setDate(d.getDate() + 1);
            dates.push(new Date(d));
        }

        return dates;
    }
};

module.exports = DateFactory;
