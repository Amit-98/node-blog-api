import jwt from 'jsonwebtoken';
import Constant from "../constant.js";

let tokenCreate=(data)=>{
    return  jwt.sign(data, Constant.JWT_SECRET_CODE, {
        expiresIn: 60 * 60 * 24 // expires time
    })
}

//When user logout...
let tokenExpire=(data)=>{
    const token = jwt.sign(data, Constant.JWT_SECRET_CODE, {
        expiresIn: '1ms' // expires time
    })

    return jwt.verify(token, Constant.JWT_SECRET_CODE, (err, decoded)=>{
        if(err)
        {
            return "LOGOUT";
        }
        else
        {
            return "LOGOUT_FAILED";
        }
    })
}

let tokenVerify=(req,res,next)=>{
    let auth = req.headers;
    if(auth.authorization)
    {
        let token= req.headers.authorization.split(' ')[1]
        jwt.verify(token, Constant.JWT_SECRET_CODE, (err, decoded)=>{
            if(err)
            {
                return next(new Error("Unauthorized_token"));
            }
            //console.log("HELLO",decoded);
            req.customer_token_details=decoded
            next()
        })
    }
    else
    {
        return next(new Error("Unauthorized_token"));
    }
}

let verify_Apikey =(req, res, next)=>{
    let auth = req.headers['api-key'];
    //console.log("TEST:", auth);
    let key = Constant.API_KEY.KEY;
    if(auth!=key || auth =="" || auth == null || auth == undefined)
    {
        return next(new Error("INVALID_KEY"));
    }
    else
    {
        next();
    }
} 

export default{
    tokenCreate,
    tokenVerify,
    tokenExpire,
    verify_Apikey
}