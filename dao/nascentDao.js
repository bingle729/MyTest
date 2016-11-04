var mysql = require('mysql');
var $conf = require('../conf/db');
var $sql = require('./nascentSqlMapping');
var log = require('log4js').getLogger("nascentDao");
function Nascent(){

}
// connection pool
var pool  = mysql.createPool($conf.mysql);

Nascent.getNascentsBySnapID = function(req, res,snapID, callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.getNascentsBySnapID, [snapID], function(err, result){
            if(err){
                connection.release();
                return callback(err);
            }
            callback(err, result);
            connection.release();
        })
    });
}

Nascent.getNascentsBySearchText = function(req, res, callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.getNascentsBySearchText, [req.body.snapID, "%" + req.body.searchText + "%", "%" + req.body.searchText + "%"], function(err, result){
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

//Nascent.getNascentsBySnapID = function(req, res,snapID,callback){
//    pool.getConnection(function(err, connection){
//        if(err){
//            return callback(err);
//        }
//
//        connection.query($sql.getNascentsBySnapID, [snapID], function(err, result){
//            if(err){
//                connection.release();
//                return callback(err);
//            }
//
//            callback(err,result);
//            connection.release();
//        })
//    });
//}

module.exports = Nascent;