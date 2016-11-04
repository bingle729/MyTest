var mysql = require('mysql');
var $conf = require('../conf/db');
var $sql = require('./greenboardSqlMapping');
var log = require('log4js').getLogger("greenboardDao");
function GreenBoard(){

}
// connection pool
var pool  = mysql.createPool($conf.mysql);

GreenBoard.getAllGreenBoards = function(req, res,callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.getAllGreenBoards, [], function(err, result){
            if(err){
                connection.release();
                return callback(err);
            }
            callback(err, result);
            connection.release();
        })
    });
}
module.exports = GreenBoard;