import Joi from "joi";
import {resError} from "../../common/joi-validator/index.js";
import _apiparam from "./productApiParams.js";

let addProducts = (req, res, next) => {
    const schema = Joi.object(
        {
            [_apiparam.ADD_NEW_PRODUCTS.name]: Joi.string().strict().trim().min(1).max(100).required(),
            [_apiparam.ADD_NEW_PRODUCTS.title]: Joi.string().strict().trim().min(1).max(200).required(),
            [_apiparam.ADD_NEW_PRODUCTS.description]: Joi.string().strict().trim().min(1).max(200).required(),
            //[_apiparam.ADD_NEW_PRODUCTS.image]: Joi.string().strict().trim().min(1).max(200).required(),
            [_apiparam.ADD_NEW_PRODUCTS.price]: Joi.string().strict().trim().min(1).max(200).required(),
            [_apiparam.ADD_NEW_PRODUCTS.stock]: Joi.string().strict().trim().min(1).max(200).required(),
            [_apiparam.ADD_NEW_PRODUCTS.quantity]: Joi.string().strict().trim().min(1).max(200).required(),
            [_apiparam.ADD_NEW_PRODUCTS.type]: Joi.string().strict().trim().min(1).max(200).required(),
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
};

let getProducts = (req, res, next) => {
    const schema = Joi.object(
        {
            [_apiparam.ADD_NEW_PRODUCTS.id]: Joi.string().strict().trim().min(1).max(100).required(),
        }
    );
    let body = req.query; 
    let { error } = schema.validate(body);
    if (error)
    {
        next(resError(error, "Invalid data in request json."));
    } 
    else 
    {
        next();
    }
};

export default {
    addProducts,
    getProducts
}