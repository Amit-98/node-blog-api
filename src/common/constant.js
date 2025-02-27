let test = {
    JWT_SECRET_CODE: 'BHNAKGSAKJKD',
    RESPONSE:
    {
        STATUSCODE:{
            OK200:200,
            BADREQ400:"400",
            ERROR500:"500",
            EXIST : "Exist",
            FAILED:400,
            SUCCESS:200,
            FAILED_AUTH:401,
        },

        STATUS:{
            SUCCESS:"Success",
            FAILED:"Failed",
            ERROR:"Error",
            EXIST : "Exist",
            AUTHORIZED:"Authorized",
            INVALIDTOKEN:"InvalidToken",
            TOKENEXPIRED:"TokenExpire"
        },
    },

    UPLOAD_IMAGE_DESTINATION:{
        LOCAL_PATH:"C:\\Users\\Amit Yadav\\Desktop\\Practical_Test\\Amit\\src\\Images\\School_Images\\",
        SERVER_PATH:"",
        LOCAL_URL:"/Images/School_Images/",
        SERVER_URL:""
    },

   FILENAME:{
    CONTROLLER:"Common_use_method.js",
   },

    OTP_PARAMETER:{
        NUM:"0123456789",
        LEN:"6",
        CODE:"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        CHAR:"ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstwxyz@#$%^&*()/",
        CHAR_LEN:"30"
    },

    API_KEY:{
        KEY:"ZG34g7#Cgpc)ZQMtnfXIb$QJGTKg^h"
    },

    DB:{
        MYSQL:"MYSQL",
        PSQL:"PSQL"
    },

    // PSQL database... 
    DB_PSQL_CONNECT:{
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: 'EquitySoft',
        port: 5432,
    }
}

export default test;