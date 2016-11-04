/**
 * Created by bingle on 2016/8/4.
 */
var snap = {
    getAllSnaps:"SELECT * FROM snapinfo",
    getSnapByID:"SELECT * FROM snapinfo WHERE snap_id=?",
    getSnapsBySearchText:"SELECT * FROM snapinfo WHERE snap_name LIKE ? OR snap_desc LIKE ?",
};

module.exports = snap;