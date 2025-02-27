import _queryBuilder from "../version-1/Auth/authQueryBuilder.js";
import _commonMethods from "../common/methods/commonMethods.js";
import {pool} from "../db/db-connect.js";

const fileName = "auth.js"

const authMiddleware = async (req, res, next)=>
{
    try
    {
        if (!(req.headers.apikey) || !(req.headers.token))
        {
            //next(new Error("INVALID_KEY", res));
            return next(new Error("INVALID_KEY"));
            //return res.status(401).json({ s: 0, m: "apikey and token are required" });
        }
        else
        {
            //req.conn = pool.getConnection();
            // let temp = pool.getConnection();
            // console.log("TEST:", temp);
            let result = _queryBuilder.authMiddleware(req);
            if(result)
            {
                req.userId = result.id;
                next();
                // res.s = 1;
                // res.m = "Login successfully";
                // res.r = result;
                // return res.sendResult();
            }   
            else
            {
                res.s = 0;
                res.m = "Authentication failed, please try again";
                return res.sendResult();
            }
        }
    }
    catch (err)
    {
        _commonMethods.saveErrorLog(fileName,authMiddleware.name, err.message, req);
        return next(new Error(err));
    }
}

export default authMiddleware;