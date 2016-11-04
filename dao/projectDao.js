/**
 * Created by bingle on 2016/8/8.
 */
var mysql = require('mysql');
var $conf = require('../conf/db');
var $sql = require('./projectSqlMapping');
var log = require('log4js').getLogger("projectDao");
function Project(project){
    this.projectID = project.projectID;
    this.projectName = project.projectName;
    this.userUID = project.userUID;
    this.snapID = project.snapID;
    this.projectDesc = project.projectDesc;
    this.updateTime = project.updateTime;
    this.createTime = project.createTime;
}
// connection pool
var pool  = mysql.createPool($conf.mysql);

Project.getProjectByName = function(req, res, callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.getProjectByName, [req.body.projectName, req.session.user.uid], function(err, result){
            if(err){
                connection.release();
                return callback(err);
            }
            //if(result.length > 0){
            //    return result;
            //}else{
            //    return null;
            //}
            if(result && result.length >0){
                callback(err, result);
            }else{
                callback(err, null);
            }
            connection.release();
        })
    });
};


Project.saveUploadFile = function(req, res,userUID, projectID,uploadMills, uploadTime, fileName,owner, callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        //console.log("a = " + userUID + ", b = " + projectID + ", c = " + uploadTime + ", d = " + fileName + ", e = " + owner);
        connection.query($sql.insertUploadFile, [userUID, projectID,uploadMills, uploadTime, fileName,owner], function(err, row){
            if(err){
                connection.release();
                return callback(err);
            }
            if(row && row.length >0){
                callback(err, row);
            }else{
                callback(err, null);
            }
            connection.release();
        });
    });
};



Project.getProjectsByStatus = function(req, res,status, callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.getProjectsByStatus, [status], function(err, result){
            if(err){
                connection.release();
                return callback(err);
            }
            callback(err,  result);
            connection.release();
        });
    });
};

Project.getUserProjects = function(req, res, callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.getUserProjects, [req.session.user.uid], function(err, result){
            if(err){
                connection.release();
                return callback(err);
            }
            callback(err,  result);
            connection.release();
        });
    });
};

Project.getUploadFiles = function(req, res, projectID, callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.getUploadFiles, [projectID], function(err, result){
            if(err){
                connection.release();
                return callback(err);
            }
            //console.log(result);
            callback(err,  result);
            connection.release();
        });
    });
};


Project.getProjectByID = function(req, res, callback){
    pool.getConnection(function(err, connection){
        if(err){
            return callback(err);
        }
        connection.query($sql.getProjectByID, [req.query.projectID], function(err, result){
            if(err){
                connection.release();
                return callback(err);
            }
            if(result.length > 0)
                callback(err,  result[0]);
            else
                callback(err, null);
            connection.release();
        });
    });
};

Project.updateProjectByAdminFeedback = function(req, res,surfaceEvaluation,surfaceFeedback,modulePlacement, moduleFeedback,overallFeedback,
                                                sketchFabURL, status, updateTime,projectID, callback){
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            return callback(err);
        }
        //console.log("1 = " + surfaceEvaluation + ",2 = " + surfaceFeedback + ", 3 = " + modulePlacement + ",4 = " + moduleFeedback +
        //", 5 = " + overallFeedback + ",6 = " + sketchFabURL + ", 7 = " + updateTime);
        connection.query($sql.updateProjectByAdminFeedback, [surfaceEvaluation, surfaceFeedback, modulePlacement,
            moduleFeedback, overallFeedback,sketchFabURL, status, updateTime, projectID], function (err, result) {
            if (err) {
                connection.release();
                return callback(err);
            }
            connection.release();
            return callback(err, result);

            //connection.release();
            //callback(err,  result);
        });
    });
};

Project.updateProjectStatus = function(req, res, status, projectID, callback){
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            return callback(err);
        }
        connection.query($sql.updateProjectStatus, [status, projectID], function (err, result) {
            if (err) {
                connection.release();
                return callback(err);
            }
            connection.release();
            return callback(err, result);

            //connection.release();
            //callback(err,  result);
        });
    });
};

Project.acceptProject = function(req, res, status,now, projectID, callback){
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            return callback(err);
        }
        connection.query($sql.acceptProject, [status,now, projectID], function (err, result) {
            if (err) {
                connection.release();
                return callback(err);
            }
            connection.release();
            return callback(err, result);

            //connection.release();
            //callback(err,  result);
        });
    });
};

Project.updateProjectImage = function(req, res, imageName, projectID, callback){
    pool.getConnection(function (err, connection) {
        if (err) {
            console.error(err);
            connection.release();
            return callback(err);
        }
        connection.query($sql.updateProjectImage, [imageName, projectID], function (err, result) {
            if (err) {
                console.error(err);
                connection.release();
                return callback(err);
            }
            connection.release();
            return callback(err, result);

            //connection.release();
            //callback(err,  result);
        });
    });
};

Project.prototype.save = function save(callback) {
    var project = {
        projectName: this.projectName,
        projectDesc:this.projectDesc,
        userUID : this.userUID,
        snapID : this.snapID,
        createTime : this.createTime,
        updateTime: this.updateTime,
    };
    pool.getConnection(function(err, connection) {
        if (err) {
            connection.release();
            return callback(err);
        }

        connection.query($sql.insertProject, [project.projectName, project.projectDesc, project.userUID,
            project.snapID, 1, project.createTime, project.updateTime], function(err, result){
            if (err) {
                console.log(err);
                connection.release();
                return callback(err);
            }
            connection.query($sql.getCreateProjectID, [project.userUID], function(err, row){
                if(err){
                    connection.release();
                    return callback(err);
                }
                if(row.length > 0){
                    return callback(err, row[0].projectID );
                }
                connection.release();

            });
            //connection.release();
            //callback(err,  result);
        });
    });

}

Project.prototype.update = function update(status, callback) {
    var project = {
        projectID: this.projectID,
        projectName: this.projectName,
        projectDesc: this.projectDesc,
        snapID: this.snapID,
        updateTime: this.updateTime,
    };
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            return callback(err);
        }
        connection.query($sql.updateProject, [project.projectName, project.projectDesc,
            project.snapID, status, project.updateTime, project.projectID], function (err, result) {
            if (err) {
                connection.release();
                return callback(err);
            }
            connection.release();
            return callback(err, result);

            //connection.release();
            //callback(err,  result);
        });
    });

}

module.exports = Project;