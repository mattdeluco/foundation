'use strict';

exports.render = function(req, res) {
    res.render('index/views/index', {
        user: req.user ? JSON.stringify(req.user) : 'null'
    });
};
