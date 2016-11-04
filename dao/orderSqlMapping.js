var order = {
    createOrder:'INSERT INTO orderunits (project_id, user_uid, create_time) VALUES (?, ?, ?) ',
    getCreatedOrderID:'SELECT MAX(order_id) AS order_id FROM orderunits WHERE project_id = ?',
    createOrderPegaboom:'INSERT INTO orderpegaboom (order_id, pegaboom_name, pegaboom_price, pegaboom_qty, pegaboom_color) VALUES ? ',
    createOrderModule:'INSERT INTO ordermodule (order_id, module_id, module_qty) VALUES ?',
    createOrderGreenboard:'INSERT INTO ordergreenboard (order_id, greenboard_id, greenboard_qty) VALUES ?',
    getAllQuote:'SELECT * FROM quote ORDER BY quote_id',

    createProductSale:'INSERT INTO productsale (product_name, product_desc, project_id, user_uid, product_time, sell_format, create_time) VALUES (?, ?, ?, ?, ?, ?, ?)',
    getCreatedProductID:'SELECT MAX(product_id) AS product_id FROM productsale WHERE project_id = ?',
    createProductCategory:'INSERT INTO productcategory (product_id, category) VALUES ?',
    createProductImage:'INSERT INTO productimage (product_id, image_name) VALUES ?',
    createProductTag:'INSERT INTO producttag (product_id, product_tag) VALUES ?',
    createProductRetail:'INSERT INTO productretail  VALUES ?',
};

module.exports = order;
