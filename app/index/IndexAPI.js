'use strict';

module.exports = function(app) {
    
    // Home route
    var index = require('./IndexController');
    app.get('/', index.render);

};
