var mysql = require('mysql');
var $conf = require('../conf/db');
var $sql = require('./orderSqlMapping');
var log = require('log4js').getLogger("orderDao");
function Order(){

}
// connection pool
var pool  = mysql.createPool($conf.mysql);

Order.createOrder = function(req, res,projectID, userUID,  createTime, callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.createOrder, [projectID,userUID, createTime], function(err, row){
            if(err){
                connection.release();
                return callback(err);
            }
            connection.query($sql.getCreatedOrderID, [projectID], function(error, row){
                if(error){
                    connection.release();
                    return callback(error);
                }
                callback(error, row[0].order_id);
                connection.release();

            });
        });
    });
};

Order.createOrderPegaboom = function(req, res, values, callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.createOrderPegaboom, [values], function(err, row){
            if(err){
                connection.release();
                return callback(err);
            }
            callback(err, row);
            connection.release();

        });
    });
};

Order.createOrderModule = function(req, res, values,callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.createOrderModule, [values], function(err, row){
            if(err){
                connection.release();
                return callback(err);
            }

            callback(err, row);
            connection.release();

        });
    });
};

Order.createOrderGreenboard = function(req, res, values,callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.createOrderGreenboard, [values], function(err, row){
            if(err){
                connection.release();
                return callback(err);
            }

            callback(err, row);
            connection.release();

        });
    });
};

Order.getAllQuote = function(req, res,callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.getAllQuote, [], function(err, result){
            if(err){
                connection.release();
                return callback(err);
            }
            callback(err, result);
            connection.release();
        });
    });
};

Order.createProductSale = function(req, res,productName, productDesc, projectID, userUID,productTime,sellFormat,  createTime, callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.createProductSale, [productName, productDesc, projectID, userUID,productTime,sellFormat,  createTime], function(err, row){
            if(err){
                connection.release();
                return callback(err);
            }
            connection.query($sql.getCreatedProductID, [projectID], function(error, row){
                if(error){
                    connection.release();
                    return callback(error);
                }
                callback(error, row[0].product_id);
                connection.release();

            });
        });
    });
};

Order.createProductCategory = function(req, res, values, callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.createProductCategory, [values], function(err, row){
            if(err){
                connection.release();
                return callback(err);
            }
            callback(err, row);
            connection.release();

        });
    });
};

Order.createProductImage = function(req, res, values, callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.createProductImage, [values], function(err, row){
            if(err){
                connection.release();
                return callback(err);
            }
            callback(err, row);
            connection.release();

        });
    });
};

Order.createProductTag = function(req, res, values, callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.createProductTag, [values], function(err, row){
            if(err){
                connection.release();
                return callback(err);
            }
            callback(err, row);
            connection.release();

        });
    });
};

Order.createProductRetail = function(req, res, values, callback){
    pool.getConnection(function(err, connection){
        if(err){
            console.error(err);
            return callback(err);
        }
        connection.query($sql.createProductRetail, [values], function(err, row){
            if(err){
                console.error(err);
                connection.release();
                return callback(err);
            }
            console.log(row);
            callback(err, row);
            connection.release();

        });
    });
};
module.exports = Order;