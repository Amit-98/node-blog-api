import async from "async";
import _queryBuilder from "./adminQueryBuilder.js";
import _commonMethods from "../../common/methods/commonMethods.js";
import _apiParams from "./adminApiParams.js";
import _apiParam from "./adminApiParams.js";
const fileName = _apiParam.FILENAME.CONTROLLER;

let categoryAdd = async (req, res, next) =>
{
    try
    {
        let result = await _queryBuilder.categoryAdd(req);
        if(result)
        {
            res.s = 1;
            res.m = "Success";
            res.r = result.insertId;
            return res.sendResult();
        }
        else
        {
            res.s = 0;
            res.m = "Failed";
            return res.sendResult();
        }
    }
    catch(err)
    {
        _commonMethods.saveErrorLog(fileName,categoryAdd.name,err.message,req);
        return next(new Error(err));
    }
};

let categoryEdit = async (req, res, next) =>
{
    try
    {
        const {id} = req.body;
        let result = await _queryBuilder.categoryEdit(req);
        if(result.affectedRows>0)
        {
            req.query.id = id;
            res.s = 1;
            res.m = "Success";
            res.r = await _queryBuilder.categoryGet(req);
            return res.sendResult();
        }
        else
        {
            res.s = 0;
            res.m = "Failed";
            return res.sendResult();
        }
    }
    catch(err)
    {
        _commonMethods.saveErrorLog(fileName,categoryAdd.name,err.message,req);
        return next(new Error(err));
    }
};

let categoryRemove = async (req, res, next) =>
{
    try
    {
        let result = await _queryBuilder.categoryRemove(req);
        if(result.affectedRows>0)
        {
            res.s = 1;
            res.m = "Success";
            return res.sendResult();
        }
        else
        {
            res.s = 0;
            res.m = "Failed";
            return res.sendResult();
        }
    }
    catch(err)
    {
        _commonMethods.saveErrorLog(fileName,categoryAdd.name,err.message,req);
        return next(new Error(err));
    }
};

let categoryGetAll = async (req, res, next) =>
{
    try
    {
        let result = await _queryBuilder.categoryGetAll(req);
        if(result)
        {
            res.s = 1;
            res.m = "Success";
            res.r = result;
            return res.sendResult();
        }
        else
        {
            res.s = 1;
            res.m = "Record not found";
            return res.sendResult();
        }
    }
    catch(err)
    {
        _commonMethods.saveErrorLog(fileName,categoryAdd.name,err.message,req);
        return next(new Error(err));
    }
};

export default {
    categoryAdd,
    categoryEdit,
    categoryRemove,
    categoryGetAll
}