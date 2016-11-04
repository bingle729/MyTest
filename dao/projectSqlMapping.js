/**
 * Created by bingle on 2016/8/8.
 */
var project = {
    insertProject:'INSERT INTO projectinfo(project_id, project_name, project_desc, user_uid, snap_id, project_status, create_time, update_time) VALUES(null,?,?,?,?,?,?,?)',
    updateProject:'UPDATE projectinfo SET project_name = ?, project_desc = ?, snap_id = ?, project_status=?, update_time = ? WHERE project_id = ? ',
    acceptProject:'UPDATE projectinfo SET project_status=?, accept_time = ? WHERE project_id = ? ',
    updateProjectImage:'UPDATE projectinfo SET project_image=? WHERE project_id = ? ',
    getCreateProjectID:'SELECT MAX(project_id) AS projectID FROM projectinfo WHERE user_uid = ? ',
    getProjectByName:"SELECT * FROM projectinfo WHERE project_name = ? AND user_uid = ?",

    getProjectFilesByProjectID:'SELECT * FROM projectfiles WHERE project_id = ? ',
    insertUploadFile:'INSERT INTO uploadfiles (user_uid, project_id,upload_mills, upload_time, file_name, owner) VALUES (?, ?,?,?, ?,?)',
    getUploadFiles:'SELECT * FROM uploadfiles WHERE project_id = ? ORDER BY upload_time',

    getProjectsByStatus:'SELECT project_id, project_name, user_name,surface_feedback,module_feedback,  projectinfo.create_time '+
       ' FROM  projectinfo, userinfo WHERE user_id != 1 AND userinfo.user_uid = projectinfo.user_uid AND project_status = ?',
    getUserProjects:'SELECT project_id, project_name, user_name,surface_feedback,module_feedback,  projectinfo.create_time, projectinfo.update_time '+
    ' FROM  projectinfo, userinfo WHERE userinfo.user_uid = ? AND userinfo.user_uid = projectinfo.user_uid',
    getProjectByID:'SELECT * FROM projectinfo WHERE project_id=?',
    updateProjectByAdminFeedback:'UPDATE projectinfo SET surface_feedback = ?, surface_feedback_info = ?, '+
    ' module_feedback = ?, module_feedback_info = ?,overall_feedback_info = ?, sketch_url=?,project_status=?, update_time = ? '+
    ' WHERE project_id = ? ',
    updateProjectStatus:'UPDATE projectinfo SET project_status=?, surface_feedback=0, module_feedback=0 WHERE project_id = ?',
};

module.exports = project;