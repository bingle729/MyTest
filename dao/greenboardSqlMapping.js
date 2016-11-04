var board = {
    getAllGreenBoards:'SELECT greenboard_id,greenboard_name, greenboard_desc, greenboard_price, greenboard_image FROM greenboard ORDER BY greenboard_id ',
};

module.exports = board;
