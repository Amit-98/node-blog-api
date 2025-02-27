import express from 'express';
import compression from 'compression';
import bodyParser from 'body-parser';
// import {pool} from "./src/db/db-connect.js";
import cors from "cors";
import src from "./src/index.js";
import helmet from "helmet";
import Response from "./src/common/response/index.js";
import { JWT, BodyValidator, APIParams, ErrorMsg } from './src/common/index.js';
import fileUpload from "express-fileupload";
import { PORT_CONFIG } from "./src/db/env_config.js";
// import serverless from 'serverless-http';
const app = express();
// global.sql = pool;

app.use(helmet());
app.use(compression())
app.use(cors());

app.use(express.urlencoded({ extended: false }));

// Parse JSON request bodies
app.use(express.json());

// Configure express-fileupload middleware for handling file uploads, createParentPath: true option ensures that the parent directories are created if they don't exist
app.use(fileUpload({ createParentPath: true }));

app.use(bodyParser.json())

let errorHandler = (err, req, res, next) =>
{
    if (typeof (err.message[0]) == 'object') 
    {
        res.json(new Response(400)
            .setMessage(err.customMsg)
            .setErrorMessage(err.message).build())
        return
    }

    if (err.name == 'ReferenceError')
    {
        res.json(new Response(503)
            .setMessage(ErrorMsg.internalErrorMsg)
            .setErrorMessage(err.message).build())
        return
    }

    if (err.message === 'Unauthorized_token')
    {
        // jwt authentication error
        res.json(new Response(401)
            .setMessage(ErrorMsg.InvalidTokenMessage)
            .setErrorMessage(ErrorMsg.Invalid_Header_Token_Message).build())
        return
    }

    if (err.message === 'INVALID_KEY')
    {
        return res.status(401).json(new Response(1)
        .setMessage(ErrorMsg.InvalidKey)
        .setErrorMessage(ErrorMsg.InvalidKeyMessage).build())
    }

    if (err.message === 'Unauthorized_auth_token')
    {
        // jwt authentication error
        res.json(new Response(401)
            .setMessage(ErrorMsg.InvalidTokenMessage)
            .setErrorMessage(ErrorMsg.InvalidTokenErrorMessage).build())
        return
    }

    if (err.name == 'Error')
    {
        // custom application error
        res.json(new Response(503)
            .setMessage(ErrorMsg.internalErrorMsg)
            .setErrorMessage(err.message).build())
        return
    }

    if (typeof (err) === 'string')
    {
        // custom application error
        res.json(new Response(200)
            .setMessage(ErrorMsg.internalErrorMsg)
            .setErrorMessage(err).build())
        return
    }

    // default to other errors
    res.s = 1;
    res.json(new Response(1)
        .setMessage(err.customMsg || ErrorMsg.internalErrorMsg)
        .setErrorMessage(err.message).build()
    )
}

let resultHandler = (req, res, next) =>
{
    // res.json(new Response(res.s || 1).setMessage(res.m || "Success").
    // setPagination(res.tr, res.page, res.pages, res.c).
    // setResultData(res.r).build())
    res.sendResult = function() {
        return res.json(new Response(res.s || 1).setMessage(res.m || "Success").
            setPagination(res.tr, res.page, res.pages, res.c).
            setResultData(res.r).build()
        )
    };
    next();
}

app.use(resultHandler);

app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"]
    })
  );
  
app.options("*", cors());

app.get("/", function (req, res)
{
    res.send("Hello World BLOG API!");
});
app.use("/api", src, resultHandler, errorHandler)

// app.get("*", function (req, res)
// {
//   if ((req.baseUrl + req.path).includes("forgot-password"))
//   {
//     res.sendFile("index.html", {
//       root: path.join(__dirname, `public/forgot-password/`)
//     });
//   }
//   else
//   {
//     return res.status(200).json({ s: 0, m: "You are not authenticated" });
//   }
// });

app.listen(PORT_CONFIG, () =>
{
    console.log(`Web server listening on: ${PORT_CONFIG}`);
})
