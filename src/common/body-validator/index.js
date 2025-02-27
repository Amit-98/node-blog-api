import { validationResult } from "express-validator";

let checkValidationError = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("error:--", errors.array());
    var errArray = errors.array();

    var msgs = errArray.map((obj) => obj.msg);

    return next(new Error(msgs.join([(separator = " || ")])));
  }
  next();
};

export default{
  checkValidationError,
};
