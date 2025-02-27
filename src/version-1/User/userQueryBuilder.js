import _dbhelper from "../../db/db-runner.js";
import _commonMethods from "../../common/methods/commonMethods.js";;
export default
{
    getAll: (reqJson, callback) =>
    {
        const _query = `SELECT * FROM user_details WHERE role = 1`;
        _dbhelper.SelectqueryM(_query, callback);
    },

    userDetails: (reqJson, callback) =>
    {
        const { id } = reqJson.query;
        const _query = `SELECT * FROM user_details WHERE id = ${id} AND status = 1 AND role = 1`;
        _dbhelper.SelectqueryS(_query, callback);
    },
}