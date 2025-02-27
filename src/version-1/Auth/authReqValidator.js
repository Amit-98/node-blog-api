import Joi from "joi";
import { resError } from "../../common/joi-validator/index.js";
import _apiparam from "./authApiParams.js";

export default 
{
    authSignup : (req, res, next) => 
    {
        const schema = Joi.object
        ({
            [_apiparam.SIGNUP_PARAM.username]: Joi.string().strict().trim().min(1).max(100).required(),

            [_apiparam.SIGNUP_PARAM.email]: Joi.string().strict().trim().min(1).max(200).required(),
            
            [_apiparam.SIGNUP_PARAM.password]: Joi.string().strict().trim().min(1).required(),
            
            [_apiparam.SIGNUP_PARAM.authtype]: Joi.string().strict().trim().min(1).required(),

            [_apiparam.SIGNUP_PARAM.role]: Joi.string().strict().trim().min(1).allow("1","2","3","4").required(),
        });
        let body = req.body; 
        let { error } = schema.validate(body);
        if (error)
        {
            next(resError(error, "Invalid data in request json."));
        } 
        else
        {
            next();
        }
    },

    authLogin : (req, res, next) => 
    {
        const schema = Joi.object
        ({
            [_apiparam.LOGIN_PARAM.email]: Joi.string().strict().trim().min(1).max(100).required(),

            [_apiparam.LOGIN_PARAM.password]: Joi.string().strict().trim().min(1).max(200).required(),
        });
        let body = req.body;
        let { error } = schema.validate(body);
        if (error) 
        {
            return next(resError(error, "Invalid data in request json."));
            //return next(new Error("INVALID_KEY"));
            // res.s = 1;
            // res.m = "Record not found";
            // res.r = {};
            // return res.sendResult();
        } 
        else
        {
            next();
        }
    },
}