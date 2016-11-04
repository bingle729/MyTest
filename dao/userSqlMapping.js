var user = {
    insert:'INSERT INTO userinfo(user_uid, user_name, user_password, create_time) VALUES(?,?,?,?)',
    queryByUsername:'SELECT user_id FROM userinfo WHERE user_name = ?',
    queryByNameAndPwd:'SELECT user_uid, user_name, user_password FROM userinfo WHERE user_name=? and user_password=?',

};

module.exports = user;
