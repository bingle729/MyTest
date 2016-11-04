var mysql = require('mysql');
var $conf = require('../conf/db');
var $sql = require('./snapSqlMapping');
var log = require('log4js').getLogger("snapDao");
function Snap(snap){
    this.id = snap.id;
    this.name = snap.name;
    this.desc = snap.desc;
    this.isFree = snap.isFree;
    this.isNa = snap.isNa;
    this.price = snap.price;
    this.image = snap.image;
}
// connection pool
var pool  = mysql.createPool($conf.mysql);

Snap.getAllSnap = function(req, res, callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.getAllSnaps, [], function(err, result){
            if(err){
                connection.release();
                return callback(err);
            }
            if(result && result.length >0){
                callback(err, result);
            }else{
                callback(err, null);
            }
            connection.release();
        })
    });
}

Snap.getSnapByID = function(req, res,snapID, callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.getSnapByID, [snapID], function(err, result){
            if(err){
                connection.release();
                return callback(err);
            }
            if(result && result.length >0){
                callback(err, result);
            }else{
                callback(err, null);
            }
            connection.release();
        })
    });
}


Snap.getSnapsBySearchText = function(req, res, callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.getSnapsBySearchText, ["%" + req.body.searchText + "%", "%" + req.body.searchText + "%"], function(err, result){
            if(err){
                connection.release();
                return callback(err);
            }

            if(result && result.length >0){
                callback(err, result);
            }else{
                callback(err, null);
            }
            connection.release();
        })
    });
}

module.exports = Snap;