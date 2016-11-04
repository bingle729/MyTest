var nascent = {
    getNascentsBySnapID:'SELECT * FROM nascentmodule WHERE nascent_id IN (SELECT nascent_id FROM snapnascent WHERE snap_id = ?)',
    getNascentsBySearchText:"SELECT nascentmodule.nascent_id, nascentmodule.nascent_name, nascentmodule.nascent_desc, nascentmodule.nascent_image, nascentmodule.nascent_file FROM nascentmodule, snapnascent WHERE snapnascent.snap_id = ? AND snapnascent.nascent_id = nascentmodule.nascent_id AND ( nascentmodule.nascent_name LIKE ? OR nascentmodule.nascent_desc LIKE ?)",
};

module.exports = nascent;
