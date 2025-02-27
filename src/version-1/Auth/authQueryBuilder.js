import _dbhelper from "../../db/db-runner.js";
import common from "../../common/methods/commonMethods.js";
export default 
{
    authMiddleware : (reqJson) => 
    {
        return new Promise((resolve, reject)=>
        {
            const { apikey, token } = reqJson.headers;
            const _query = `SELECT user.* FROM userauth INNER JOIN user ON user.id = userauth.userId
            WHERE userauth.apikey = '${apikey}' and userauth.token = '${token}' AND user.status = 1`;
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

    authCheckEmail : (reqJson) =>
    {
        return new Promise((resolve, reject)=>
        {
            const {email} = reqJson.body;
            const _query = `SELECT * FROM user WHERE email = '${email}' AND status !=-1`;
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

    authSignup : (reqJson) =>
    {
        return new Promise((resolve, reject)=>
        {
            const {username, email, password, role} = reqJson.body;
            let authtype = parseInt(reqJson.body.authtype);
            let pass = common.generate_password(password);
            const _query = `INSERT INTO user(authtype,username,email,password,status)VALUES(${authtype},'${username}', '${email}', '${pass}',1)`;
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

    authSignupToken : (reqJson) =>
    {
        return new Promise((resolve, reject)=>
        {
            const apikey = common.random_string();
            const token = common.random_string();
            const _query = `INSERT INTO userauth(userId,apikey,token)VALUES(${reqJson.body.userId},'${apikey}','${token}')`;
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

    authRole : (reqJson) =>
    {
        return new Promise((resolve, reject)=>
        {
            const _query = `INSERT INTO userrole(userId,role,status)VALUES(${reqJson.body.userId},${reqJson.body.role},1)`;
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

    authSuccess : (reqJson) =>
    {
        return new Promise((resolve, reject)=>
        {
            const _query = `SELECT * FROM user WHERE id = ${reqJson.body.userId}`;
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

    authTokenSuccess : (reqJson) =>
    {
        return new Promise((resolve, reject)=>
        {
            const _query = `SELECT id,userId,apikey,token FROM userauth WHERE userId = ${reqJson.body.userId}`;
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

    authRoleSuccess : (reqJson) =>
    {
        return new Promise((resolve, reject)=>
        {
            const _query = `SELECT userrole.id, userrole.userId,userrole.role,role.role,userrole.status FROM userrole 
            INNER JOIN role ON userrole.role = role.id
            WHERE userId = ${reqJson.body.userId}`;
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
};