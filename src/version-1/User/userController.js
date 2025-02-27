import async from "async";
import _queryBuilder from "./userQueryBuilder.js";
import _commonMethods from "../../common/methods/commonMethods.js";;
import _apiParam from "./userApiParams.js";
const fileName = _apiParam.FILENAME.CONTROLLER;

let getAll = (req, res, next) =>
{
    try
    {
        async.waterfall(
        [
            function (callback)
            {
                try
                {
                    _queryBuilder.getAll(req, (err, _result) =>
                    {
                        if (err)
                        {
                            return next(new Error(err));
                        }
                        try
                        {
                            if (_result != null && _result != "")
                            {
                                callback(null, _result);
                            }
                            else
                            {
                                res.s = 404;
                                res.m = "Record not found";
                                res.r = {};
                                next();
                            }
                        }
                        catch (err)
                        {
                            _commonMethods.saveErrorLog(fileName, getAll.name, err.message, req);
                            next(err);
                        }
                    });
                }
                catch (err)
                {
                    _commonMethods.saveErrorLog(fileName, getAll.name, err.message, req);
                    next(err);
                }
            },
        ],
        function (err, _finalResult)
        {
            if (err)
            {
                return next(new Error(err));
            }
            else
            {
                if (_finalResult != null && _finalResult != "") 
                {
                    res.s = 1;
                    res.m = "Record found successfully";
                    res.r = _finalResult;
                    next();
                }
                else
                {
                    res.s = 404;
                    res.m = "Record not found";
                    res.r = {};
                    next();
                }
            }
        });
    }
    catch (err)
    {
        _commonMethods.saveErrorLog(fileName, getAll.name, err.message, req);
        next(err);
    }
};

let userDetails = (req, res, next) =>{
    try
    {
        async.waterfall(
        [
            function (callback)
            {
                try
                {
                    _queryBuilder.userDetails(req, (err, _result) =>
                    {
                        if (err)
                        {
                            return next(new Error(err));
                        }
                        try
                        {
                            if (_result != null && _result != "")
                            {
                                callback(null, _result);
                            }
                            else
                            {
                                res.s = 404;
                                res.m = "Record not found";
                                res.r = {};
                                next();
                            }
                        }
                        catch (err)
                        {
                            _commonMethods.saveErrorLog(fileName, getAll.name, err.message, req);
                            next(err);
                        }
                    });
                }
                catch (err)
                {
                    _commonMethods.saveErrorLog(fileName, getAll.name, err.message, req);
                    next(err);
                }
            },
        ],
        function (err, _finalResult)
        {
            if (err)
            {
                return next(new Error(err));
            }
            else
            {
                if (_finalResult != null && _finalResult != "") 
                {
                    res.s = 1;
                    res.m = "Record found successfully";
                    res.r = _finalResult;
                    next();
                }
                else
                {
                    res.s = 404;
                    res.m = "Record not found";
                    res.r = {};
                    next();
                }
            }
        });
    }
    catch(err)
    {
        _commonMethods.saveErrorLog(fileName,userDetails.name, err.message, req);
    }
}

export default {
    getAll,
    userDetails
}