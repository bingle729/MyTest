var express = require('express');
var User = require('../dao/userDao');

var Snap = require('../dao/snapDao');
var Nascent = require('../dao/nascentDao');
var Project = require("../dao/projectDao");
var GreenBoard = require("../dao/greenboardDao");
var router = express.Router();
var crypto = require('crypto');

var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

var log = require('log4js').getLogger("index");

/* GET home page. */
router.get('/', function(req, res, next) {
  Snap.getAllSnap(req,  res,  function(err, snaps){
    if(err){
      snaps = [];
    }
    res.render('start_project', {
      title: 'Start Project',
      snaps:snaps,
      searchText:'',
      user:req.session.user,
      success:req.flash('success').toString(),
      error:req.flash('error').toString()
  });

  });

  //res.render('submit_project', {title: 'submit'});
});

router.get('/start_project', function(req, res){
  Snap.getAllSnap(req,  res,  function(err, snaps){
    if(err){
      snaps = [];
    }
    res.render('start_project', {
      title: 'Start Project',
      snaps:snaps,
      searchText:'',
      user:req.session.user,
      success:req.flash('success').toString(),
      error:req.flash('error').toString()
    });
  });



  /*User.queryByUsername(req, res, function(err, user){
    if(user){
      //console.log('用户存在');
      //req.flash('error', '该用户已存在');
      res.send({msgCode:1,msgContent:'Username already exist.'});
    }else{
      res.send({msgCode:2,msgContent:'Username can be used.'});
    }
  }) ;*/
});

router.post('/snap_search', function(req, res){
  if(req.body.searchText == null || req.body.searchText == ''){
      res.redirect('/start_project');
  }else{
    Snap.getSnapsBySearchText(req,  res,  function(err, snaps){
      if(err){
        snaps = [];
      }
      if(snaps == null)
        snaps = [];
      res.render('start_project', {
        title: 'Start Project',
        snaps:snaps,
        user:req.session.user,
        searchText:req.body.searchText,
        success:req.flash('success').toString(),
        error:req.flash('error').toString()
      });
    });
  }

});

router.get('/nascent_modules', function(req, res){
  Nascent.getNascentsBySnapID(req,  res, req.query.snapID, function(err, nascents){
    if(err){
      nascents = [];
    }
    if(nascents == null){
      nascents = [];
    }
    res.render('nascent_modules', {
      title: 'Nascent Modules',
      snapID: req.query.snapID,
      searchText:req.body.searchText,
      nascents:nascents,
    });
  });
});

router.post('/module_search', checkLogin);
router.post('/module_search', function(req, res){
  if(req.body.searchText == null || req.body.searchText == ''){
    res.redirect('/nascent_modules?snapID=' + req.body.snapID);
  }else{
    Nascent.getNascentsBySearchText(req,  res,  function(err, nascents){
      if(err){
        nascents = [];
      }
      if(nascents == null)
        nascents = [];
      res.render('nascent_modules', {
        title: 'Start Project',
        snapID: req.body.snapID,
        searchText:req.body.searchText,
        nascents:nascents,
      });
    });
  }

});

//router.get('/login', function(req, res, next) {
//  res.render('login', {
//    title: 'Nascent',
//    user:req.session.user,
//    success:req.flash('success').toString(),
//    error:req.flash('error').toString()
//  });
//});





router.get('/submit_project', function(req, res){
  //console.log('snapId22 = ' +  req.param('snapID'));
  //res.render('submit_project',
  //    {title: 'submit project',
  //      snapID: req.query.snapID,
  //});
  res.render('submit_project',
      {title: 'Submit project page',
        projectID:0,
        projectName:"",
        projectDesc:"",
        snapID: req.query.snapID,
        uploadFiles:[],
      });
});

router.post('/verifyProjectName', checkLogin);
router.post('/verifyProjectName', function(req, res){
  Project.getProjectByName(req,  res,  function(err, project){
    if(project){
      res.send({msgCode:1,msgContent:project[0].project_id});
    }else{
      res.send({msgCode:2,msgContent:-1});
    }

  });
});

router.post('/submit_project', checkLogin);
router.post('/submit_project', function(req, res){
  var current = new Date();
  var newProject = new Project({
    projectName: req.body.projectName,
    projectDesc: req.body.projectDesc,
    userUID: req.session.user.uid,
    snapID: req.body.snapID,
    createTime : current,
    updateTime: current,
  });
  newProject.save(function(err, index){
    if(err){
      req.flash('error', err);
      return res.redirect('/start_project');
    }
    newProject.projectID = index;
    //console.log("111 = " + newProject.projectID);
    //saveProject(req,  res,  newProject);
    res.send({msgCode:1,msgContent:newProject.projectID});
  });
});

function saveUploadFile(req, res, userUID, projectID,uploadMills, uploadTime, fileName, owner){
  Project.saveUploadFile(req, res, userUID, projectID, uploadMills, uploadTime, fileName,owner, function(err, row){
    if(err){
      req.flash('error', err);
      return res.redirect('/start_project');
    }
  });
  //Project.saveProjectFile(req,  res,  projectID, fileName, function(err, row){
  //  if(err){
  //    req.flash('error', err);
  //    return res.redirect('/start_project');
  //  }else{
  //
  //  }
  //});
  //res.send('success');
}

//post project files by user
router.post('/uploadProjectFiles', checkLogin);
router.post('/uploadProjectFiles', function(req, res){
  var userUID = req.session.user.uid;
  //console.log("uid = " + userUID);
  //console.log('id = ' + req.params.projectID);
  var projectID = req.query.projectID;
  var changeStatus = req.query.changeStatus;
  var nowDate = new Date();
  var nowMills = nowDate.getTime();

  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.uploadDir = path.join(path.dirname(module.parent.filename), '/uploads');
  //console.log("uploadDir = " + path.join(__dirname, 'views'));
  //var json = [];
  var userProjectDir = path.join(form.uploadDir, '/' + userUID + "_" + projectID);
  if (!fs.existsSync(userProjectDir)) {
    fs.mkdirSync(userProjectDir);
  }
  var timeDir = path.join(userProjectDir, "/" + nowMills);
  if (!fs.existsSync(timeDir)) {
    fs.mkdirSync(timeDir);
  }

    form.on('file', function(field, file) {
    fs.rename(file.path, path.join(timeDir, file.name));
    //json.push(userUID + "_"+ projectID+ "_"+ file.name);
    //console.log("filename = " + userUID+ "_" + file.name);
    //saveProjectFiles(req, res, projectID,  userUID + "_"+ projectID+ "_"+ file.name);
      saveUploadFile(req, res, userUID, projectID, nowMills, nowDate, file.name, 1);
  });
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    if(changeStatus){
      Project.updateProjectStatus(req, res, 1, projectID, function(e, result){

      });
    }
    res.send("OK");

    //res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);
});

//to show projects page
router.get('/show_projects', checkLogin);
router.get('/show_projects', function(req, res){
  if(req.session.user.name == 'admin'){
    res.render('show_projects', {title: 'Show projects page'});
  }else{
    res.render('show_user_projects', {title: 'Show user projects page'});
  }

});

router.post('/getSubmittedProjects', checkLogin);
router.post('/getSubmittedProjects', function(req, res){
  Project.getProjectsByStatus(req,  res, 1, function(err, projects){
    res.json(projects);
  });
});

router.post('/getFeedbackProjects', checkLogin);
router.post('/getFeedbackProjects', function(req, res){
  Project.getProjectsByStatus(req,  res, 2, function(err, projects){
    res.json(projects);
  });
});

router.post('/getUserProjects', checkLogin);
router.post('/getUserProjects', function(req, res){
  Project.getUserProjects(req,  res, function(err, projects){
    res.json(projects);
  });
});

//to admin feedback
router.get('/admin_feedback', checkLogin);
router.get('/admin_feedback', function(req, res){
  Project.getProjectByID(req,  res, function(err, project){
    if(!project){
      req.flash('error', 'No such project.');
      return res.redirect('/show_projects');
    }
    Project.getUploadFiles(req, res, project.project_id, function(e,uploadFiles){
      if(e){
        uploadFiles = [];
      }
      Snap.getSnapByID(req,  res,  project.snap_id, function(error, snap){
        Nascent.getNascentsBySnapID(req, res,project.snap_id, function(error1, nascents){
          if(error1){
            nascents = [];
          }
          res.render('admin_feedback',
              {title: 'Admin feedback page',
                project:project,
                snapName:snap[0].snap_name,
                nascents: nascents,
                uploadFiles:uploadFiles,
              });
        });

      });
    });


  });
});


router.get('/recieved_feedback', checkLogin);
router.get('/recieved_feedback', function(req, res){
  Project.getProjectByID(req,  res, function(err, project){
    if(!project){
      req.flash('error', 'No such project.');
      return res.redirect('/show_projects');
    }
    Project.getUploadFiles(req, res, project.project_id, function(e,uploadFiles){
      if(e){
        uploadFiles = [];
      }
      Snap.getSnapByID(req,  res,  project.snap_id, function(error, snap){
        Nascent.getNascentsBySnapID(req, res,project.snap_id, function(error1, nascents){
          if(error1){
            nascents = [];
          }
          res.render('recieved_feedback',
              {title: 'Recieved feedback page',
                project:project,
                snapName:snap[0].snap_name,
                nascents: nascents,
                uploadFiles:uploadFiles,
              });
        });

      });
    });


  });
});

//get recieved_feedback_accept
router.get('/recieved_feedback_accept', checkLogin);
router.get('/recieved_feedback_accept', function(req, res){
  var projectID = req.query.projectID;
  var now= new Date();
  Project.acceptProject(req, res, 3, now, projectID, function(e, result){
    return res.redirect('/orders/order_units?projectID=' + projectID);

  });
});

//get recieved_feedback_edit
  router.get('/recieved_feedback_edit', checkLogin);
  router.get('/recieved_feedback_edit', function(req, res){

    Project.getProjectByID(req,  res, function(err, project){
      if(!project){
        req.flash('error', 'No such project.');
        return res.redirect('/show_projects');
      }
      Project.getUploadFiles(req, res, project.project_id, function(e,uploadFiles){
        if(e){
          uploadFiles = [];
        }
        Snap.getSnapByID(req,  res,  project.snap_id, function(error, snap){
          Nascent.getNascentsBySnapID(req, res,project.snap_id, function(error1, nascents){
            if(error1){
              nascents = [];
            }
            //console.log('projectDesc = ' + project.project_desc);
            res.render('submit_project',
                {title: 'Submit project page',
                  projectID:project.project_id,
                  projectName:project.project_name,
                  projectDesc:project.project_desc,
                  snapID:project.snap_id,
                  uploadFiles:uploadFiles,
                });
          });
        });
      });
    });
  });


//post admin_feedback_submit
router.post('/admin_feedback_submit',checkLogin);
router.post('/admin_feedback_submit', function(req, res){
  var userUID = req.query.userUID;
  var projectID = req.query.projectID;
  var nowDate = new Date();
  var nowMills = nowDate.getTime();
  var surfaceEvaluation = "";
  var surfaceFeedback = "";
  var modulePlacement = "";
  var moduleFeedback = "";
  var overallFeedback = "";
  var sketchFabURL = "";
  var status = 2;
  var feedbackDir = path.join(path.dirname(module.parent.filename), '/uploads/admin');
  var userProjectDir = path.join(feedbackDir, '/' + userUID + "_" + projectID);
  if (!fs.existsSync(userProjectDir)) {
    fs.mkdirSync(userProjectDir);
  }
  var timeDir = path.join(userProjectDir, "/" + nowMills);
  if (!fs.existsSync(timeDir)) {
    fs.mkdirSync(timeDir);
  }
  var form = new formidable.IncomingForm();
  //var files = [];
  form.multiples = true;
  form.uploadDir = path.join(path.dirname(module.parent.filename), '/uploads/admin/temp');
  form.on('file', function(field, file) {
    /*if(field=='quoteFile'){
      fs.rename(file.path, path.join(userProjectDir, "quote.csv"));
    }else{
      fs.rename(file.path, path.join(timeDir, file.name));
      saveUploadFile(req, res, userUID, projectID, nowMills, nowDate, file.name, 2);
    }*/
    fs.rename(file.path, path.join(timeDir, file.name));
    saveUploadFile(req, res, userUID, projectID, nowMills, nowDate, file.name, 2);

  });
  form.on('field', function(field, value){
    //console.log(field +" = " + value);
    if(field == 'surfaceEvaluation'){
      surfaceEvaluation = value;
    }
    if(field == 'surfaceFeedback'){
      surfaceFeedback = value;
    }
    if(field == 'modulePlacement'){
      modulePlacement = value;
    }
    if(field == 'moduleFeedback'){
      moduleFeedback = value;
    }
    if(field == 'overallFeedback'){
      overallFeedback = value;
    }
    if(field == 'sketchFabURL'){
      sketchFabURL = value;
    }

  });
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    if (sketchFabURL != null && sketchFabURL != '') {
      var index = sketchFabURL.indexOf('http');
      if (index != 0) {
        sketchFabURL = "http://" + sketchFabURL;
      }
    }
    Project.updateProjectByAdminFeedback(req, res, surfaceEvaluation,surfaceFeedback,modulePlacement, moduleFeedback,overallFeedback,
        sketchFabURL, status, nowDate,projectID, function(e, result){
          //res.render('show_projects', {title: 'Show projects page'});
          //res.contentType('application/json');
          res.send("OK");
        });

    //res.send("OK");
  });

  // parse the incoming request containing the form data
  form.parse(req);
});

/*router.get('/order_units', checkLogin);
router.get('/order_units', function(req, res){
  var userUID = req.session.user.uid;
  Project.getProjectByID(req,  res, function(err, project){
    if(!project){
      req.flash('error', 'No such project.');
      return res.redirect('/show_projects');
    }

    Project.getUploadFiles(req, res, project.project_id, function(e,uploadFiles){
      if(e){
        uploadFiles = [];
      }
      Snap.getSnapByID(req,  res,  project.snap_id, function(error, snap){
        Nascent.getNascentsBySnapID(req, res,project.snap_id, function(error1, nascents){
          if(error1){
            nascents = [];
          }
          GreenBoard.getAllGreenBoards(req,res, function(error2, greenboards){
            if(error2){
              greenboards = [];
            }
            var greenboardJson = JSON.parse(JSON.stringify(greenboards));
            //console.log(JSON.stringify(components));
            var now = new Date();
            var diff = 30 - parseInt((project.accept_time.getTime() - now.getTime())/(24 * 60 * 60 * 1000));
            //read from csv file to json
            var csvPath = "uploads/admin/" + userUID + "_" +req.query.projectID+"/quote.csv";
            var Converter = require("csvtojson").Converter;
            var fileStream = fs.createReadStream(csvPath);
            var converter = new Converter({constructResult:true});
            converter.on("end_parsed", function (jsonObj) {
              //console.log(JSON.stringify(jsonObj)); //here is your result json object
              res.render('order_units',
                  {title: 'Recieved feedback page',
                    project:project,
                    snapName:snap[0].snap_name,
                    nascents: nascents,
                    uploadFiles:uploadFiles,
                    diffDay:diff,
                    quoteJson:jsonObj,
                    greenboardJson:greenboardJson,
                  });
            });
            fileStream.pipe(converter);
          });
        });
      });
    });
  });
});

router.post('/uploadProjectImage', checkLogin);
router.post('/uploadProjectImage', function(req, res){
  var userUID = req.session.user.uid;
  var projectID = req.query.projectID;
  var imageName = "";
  var nowDate = new Date();
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(path.dirname(module.parent.filename), '/uploads');
  var userProjectDir = path.join(form.uploadDir, '/' + userUID + "_" + projectID);
  if (!fs.existsSync(userProjectDir)) {
    fs.mkdirSync(userProjectDir);
  }
  form.on('file', function(field, file) {
      fs.rename(file.path, path.join(userProjectDir, file.name));
      imageName = file.name;
      Project.updateProjectImage(req,res,file.name, projectID, function(err, result){

      });
  });
  form.on('end', function() {
    res.send(userUID + "_" + projectID + '/'+ imageName );
    //res.send("OK");
  });
  form.parse(req);
});
*/

function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'Not login');
    return res.redirect('/users/login');
  }
  next();
}

function checkNotLogin(req, res, next){
  if(req.session.user){
    req.flash('error', 'Logged in.');
    return res.redirect('/');
  }
  next();
}

router.get('/logout', function(req, res){
  req.session.user = null;
  req.flash('success', 'logout');
  res.redirect('/');
});

module.exports = router;
