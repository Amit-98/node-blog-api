import async from "async";
import _queryBuilder from "./authQueryBuilder.js";
import _commonMethods from "../../common/methods/commonMethods.js";
import _apiParams from "./authApiParams.js";
const fileName = _apiParams.FILENAME.CONTROLLER;

let authSignup = async (req, res, next) => 
{
    try
    {
        let result = await _queryBuilder.authCheckEmail(req);
        if(result)
        {
            res.s = 1;
            res.m = "Email already exist";
            res.r = {};
            return res.sendResult();
        }
        else
        {
            const resultSignup = await _queryBuilder.authSignup(req);
            if(resultSignup)
            {
                req.body.userId = resultSignup.insertId; 
                let resultTokenIns = await _queryBuilder.authSignupToken(req);
                const resultRoleIns = await _queryBuilder.authRole(req);
                const resultAuthSuccess = await _queryBuilder.authSuccess(req);
                if(resultAuthSuccess)
                {
                    const resultAuthToken = await _queryBuilder.authTokenSuccess(req);
                    const resultRole = await _queryBuilder.authRoleSuccess(req);
                    resultAuthSuccess.userAuthToken = resultAuthToken;
                    resultAuthSuccess.userRole = resultRole;
                    res.s = 1;
                    res.m = "Signup successfully";
                    res.r = resultAuthSuccess;
                    return res.sendResult();
                }
                else
                {
                    res.s = 1;
                    res.m = "Record not found";
                    res.r = {};
                    return res.sendResult();
                }
            }
            else
            {
                res.s = 1;
                res.m = "Something went wrong!";
                return res.sendResult();
            }
        }
    }
    catch (err)
    {
        _commonMethods.saveErrorLog(fileName,authSignup.name,err.message,req);
        return next(new Error(err));
    }
};

let authLogin = async (req, res, next) => 
{
    try
    {
        const {password} = req.body;
        const result = await _queryBuilder.authCheckEmail(req);
        if(result)
        {
            const passCheck = _commonMethods.check_password(result.password, password);
            if(passCheck)
            {
                req.body.userId = result.id;
                const resultAuthToken = await _queryBuilder.authTokenSuccess(req);
                const resultRole = await _queryBuilder.authRoleSuccess(req);
                if(resultAuthToken && resultRole)
                {
                    result.userAuthToken = resultAuthToken;
                    result.userRole = resultRole;
                    res.s = 1;
                    res.m = "Login successfully";
                    res.r = result;
                    return res.sendResult();
                }
                else
                {
                    res.s = 0;
                    res.m = "Please enter valid crendential";
                    res.r = {};
                    return res.sendResult();
                }
            }
            else
            {
                res.s = 0;
                res.m = "Please enter valid crendential";
                res.r = {};
                return res.sendResult();
            }
        }
        else
        {
            res.s = 0;
            res.m = "Please enter valid crendential";
            res.r = {};
            return res.sendResult();
        }
    }
    catch(err)
    {
        _commonMethods.saveErrorLog(fileName,authLogin.name,err.message,req);
        return next(new Error(err));
    }
};

export default {
    authSignup,
    authLogin
}