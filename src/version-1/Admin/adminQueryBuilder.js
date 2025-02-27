import _dbhelper from "../../db/db-runner.js";

export default {
    categoryAdd : (reqJson) =>
    {
        return new Promise((resolve, reject)=>
        {
            const _query = `INSERT INTO category(name,status)VALUES('${reqJson.body.name}',1)`;
            _dbhelper.InsertQuery(_query,(err, result)=>
            {
                if(err)
                {
                    reject(err);
                    return;
                }
                else
                {
                    resolve(result);
                }
            });
        });
    },

    categoryEdit : (reqJson) =>
    {
        return new Promise((resolve, reject)=>
        {
            const _query = `UPDATE category SET name = '${reqJson.body.name}' WHERE id = ${reqJson.body.id} AND status = 1`;
            _dbhelper.Updatequery(_query,(err, result)=>
            {
                if(err)
                {
                    reject(err);
                    return;
                }
                else
                {
                    resolve(result);
                }
            });
        });
    },

    categoryRemove : (reqJson) =>
    {
        return new Promise((resolve, reject)=>
        {
            const _query = `UPDATE category SET status = -1 WHERE id IN (${reqJson.body.id})`;
            _dbhelper.Updatequery(_query,(err, result)=>
            {
                if(err)
                {
                    reject(err);
                    return;
                }
                else
                {
                    resolve(result);
                }
            });
        });
    },

    categoryGetAll : (reqJson) =>
    {
        return new Promise((resolve, reject)=>
        {
            const _query = `SELECT * FROM category WHERE status !=-1`;
            _dbhelper.SelectqueryM(_query,(err, result)=>
            {
                if(err)
                {
                    reject(err);
                    return;
                }
                else
                {
                    resolve(result);
                }
            });
        });
    },

    categoryGet : (reqJson) =>
    {
        return new Promise((resolve, reject)=>
        {
            const {id} = reqJson.query;
            const _query = `SELECT * FROM category WHERE id = ${id}`;
            _dbhelper.SelectqueryS(_query,(err, result)=>
            {
                if(err)
                {
                    reject(err);
                    return;
                }
                else
                {
                    resolve(result);
                }
            });
        });
    },
}