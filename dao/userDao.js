/**
 * Created by bingle on 2016/8/2.
 */
var mysql = require('mysql');
var $conf = require('../conf/db');
var $sql = require('./userSqlMapping');
var log = require('log4js').getLogger("userDao");
function User(user){
    this.name = user.name;
    this.password = user.password;
    this.uid = user.uid;
    this.createTime = user.createTime;
}
// connection pool
var pool  = mysql.createPool($conf.mysql);

// return json to page
var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code:'1',
            msg: 'Failed'
        });
    } else {
        res.json(ret);
    }
};

User.queryByUsername = function(req, res, callback){
    //console.log('user = ' + req.body.username);
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.queryByUsername, [req.body.username], function(err, result){
            if(err){
                connection.release();
                return callback(err);
            }
            if(result && result.length >0){
                var user = new User(result);
                callback(err, user);
            }else{
                callback(err, null);
            }
            connection.release();
        })
    });
}



User.prototype.save = function save(callback) {
    var user = {
        name: this.name,
        password: this.password,
        uid: this.uid,
        createTime: this.createTime,
    };
    //console.log('name = ' + user.name + ", password = " + user.password);
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            return callback(err);
        }

        //console.log('nam e= ' + user.name + ",password = " + user.password);
        connection.query($sql.insert, [user.uid, user.name,  user.password,user.createTime], function(err, result){
            if (err) {
                connection.release();
                return callback(err);
            }
            connection.release();
            callback(err,  result);
        });
    });

}

User.prototype.get = function get(req, res, callback) {
    var user = {
        name: this.name,
        password: this.password,
        uid :this.uid
    };
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            return callback(err);
        }
        //console.log('name = ' + user.name + ", password = " + user.password);
        connection.query($sql.queryByNameAndPwd, [user.name,  user.password], function (err, rows) {
            if (err) {
                connection.release();
                return callback(err);
            }
            if(rows && rows.length >0){
                //var newUser = new User(user);
                user.name = rows[0].user_name;
                user.password = rows[0].user_password;
                user.uid = rows[0].user_uid;
                callback(err, user);
            }else{
                callback(err,  null);
            }
            connection.release();
        });
    });
};


module.exports = {
    queryByUsername:function(req, res, next){
        pool.getConnection(function(err, connection){
            connection.query($sql.queryByUsername, [req.body.username], function(err, rows, result){
               //log.debug(rows);
                if(rows.length > 0){
                    req.session.error = 'User already exists.';
                }

                connection.release();
            });
        });
    },
    add: function (req, res, next) {
        pool.getConnection(function (err, connection) {
            // 获取前台页面传过来的参数
            var param = req.query || req.params;
            // 建立连接，向表中插入值
            // 'INSERT INTO user(id, name, age) VALUES(0,?,?)',
            connection.query($sql.queryByUsername, [req.body.username], function(err, rows, result){
                log.debug(rows);
                if(rows > 0){
                    req.session.error = 'User already exists.';
                    return res.redirect('/reg');
                }
                var current = new Date();
                connection.query($sql.insert, [current.getTime(), req.body.username, req.body.password, current.toDateString()], function (err, result) {
                    log.debug(result);
                    if (result) {
                        // result = {
                        // 	code: 200,
                        // 	msg:'增加成功'
                        // };
                        res.redirect('/login');
                    }

                    // 以json形式，把操作结果返回给前台页面
                    // jsonWrite(res, result);


                    // 释放连接
                    connection.release();
                });
            });

        });
    }
};

module.exports = User;