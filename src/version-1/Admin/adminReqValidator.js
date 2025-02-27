import Joi from "joi";
import { resError } from "../../common/joi-validator/index.js";
import _apiparam from "./adminApiParams.js";

export default 
{
    categoryAdd : (req, res, next) => 
    {
        const schema = Joi.object(
            {
                [_apiparam.CATEGORY.name]: Joi.string().strict().trim().min(1).max(100).required(),
            }
        );
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

    categoryEdit : (req, res, next) => 
    {
        const schema = Joi.object(
            {
                [_apiparam.CATEGORY.id]: Joi.number().required(),
                [_apiparam.CATEGORY.name]: Joi.string().strict().trim().min(1).max(100).required(),
            }
        );
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

    categoryRemove : (req, res, next) => 
    {
        const schema = Joi.object(
            {
                [_apiparam.CATEGORY.id]: Joi.number().required(),
            }
        );
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

}