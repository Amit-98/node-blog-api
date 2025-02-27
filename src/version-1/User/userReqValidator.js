import Joi from "joi";
import { resError } from "../../common/joi-validator/index.js";
import _apiparam from "./userApiParams.js";

export default {
    userDetails: (req, res, next) =>
    {
        const schema = Joi.object(
            {
                [_apiparam.USER.id]: Joi.number().required(),
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
    },
}