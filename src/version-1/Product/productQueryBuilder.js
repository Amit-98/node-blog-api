import _dbhelper from "../../db/db-runner.js";
import _commonMethods from "../../common/methods/commonMethods.js";;
export default
{
    addProducts: async (reqJson, callback) =>
    {
        const imageUpload = await _commonMethods.uploadFileS(reqJson.files.image,"image/product");
        let img = await _commonMethods.uploadToCloudinary(imageUpload);

        const { name, title, description, price, stock, quantity, type } = reqJson.body;
        //image = "image/test.jpg";
        let image = reqJson.body.image;
        image = img;
        const _query = `INSERT INTO product_master(name,title,description,image,price,stock,quantity,type,status)
        VALUES('${name}','${title}','${description}','${image}','${price}',${stock},${quantity},${type},1)`;
        _dbhelper.InsertQuery(_query, callback);
    },

    getProducts: (reqJson, callback) =>
    {
        const _query = `SELECT * FROM user_master WHERE USER_ID = ${reqJson.query.id}`;
        _dbhelper.SelectqueryS(_query, callback);
    },

    getAll: (reqJson, callback) =>
    {
        const _query = `SELECT * FROM user_master`;
        _dbhelper.SelectqueryM(_query, callback);
    },
}