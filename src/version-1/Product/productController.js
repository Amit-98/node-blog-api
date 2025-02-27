import async from "async";
import _queryBuilder from "./productQueryBuilder.js";
import _commonMethods from "../../common/methods/commonMethods.js";;
import _apiParam from "./productApiParams.js";
const fileName = _apiParam.FILENAME.CONTROLLER;

let addProducts = (req, res, next) =>
{
    try
    {
        async.waterfall([
            function(callback)
            {
                try
                {
                    // const image = await _commonMethods.uploadFileS(req.files.image,"image/product");
                    // let img = await _queryBuilder.uploadToCloudinary(image);
                    // //callback(null, {test:0});
                    _queryBuilder.addProducts(req, (err, _result) =>
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
                                res.s = 400;
                                res.m = "Record not saved";
                                res.r = {};
                                next();
                            }
                        }
                        catch (err)
                        {
                            _commonMethods.saveErrorLog(fileName, addProducts.name, err.message, req);
                            next(err);
                        }
                    });
                }
                catch (err)
                {
                    _commonMethods.saveErrorLog(fileName, addProducts.name, err.message, req);
                    next(err);
                }
            },
            function (add_product_result, callback)
            {
                try
                {
                    req.query.id = add_product_result.insertId;
                    _queryBuilder.getProducts(req, (err, _result) =>
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
                            _commonMethods.saveErrorLog(fileName, addProducts.name, err.message, req);
                            next(err);
                        }
                    });
                }
                catch (err)
                {
                    _commonMethods.saveErrorLog(fileName, addProducts.name, err.message, req);
                    next(err);
                }
            }
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
                    res.m = "Product Added Successfully";
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
        _commonMethods.saveErrorLog(fileName, addProducts.name, err.message, req);
        next(err);
    }
};

let getProducts = (req, res, next) =>
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
                                _commonMethods.saveErrorLog(fileName, getProducts.name, err.message, req);
                                next(err);
                            }
                        });
                    }
                    catch (err)
                    {
                        _commonMethods.saveErrorLog(fileName, getProducts.name, err.message, req);
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
        _commonMethods.saveErrorLog(fileName, getProducts.name, err.message, req);
        next(err);
    }
}

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
                            console.log("ERROR:", err);
                            _commonMethods.saveErrorLog(fileName, getProducts.name, err.message, req);
                            next(err);
                        }
                    });
                }
                catch (err)
                {
                    _commonMethods.saveErrorLog(fileName, getProducts.name, err.message, req);
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
        console.log("ERROR:", err);
        _commonMethods.saveErrorLog(fileName, getProducts.name, err.message, req);
        next(err);
    }
}

export default {
    addProducts,
    getProducts,
    getAll
}