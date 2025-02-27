import _constant from "../constant.js";
import crypto from "crypto";
import { promises as fs } from 'fs';
import _dbhelper from "../../db/db-runner.js";
import path from "path";
import api_error_log_detail from "../../db/db-schema/api_error_log_detail.js";
const _otp_parameter = _constant.OTP_PARAMETER;
let _status_msg = _constant.FINAL_RESULT_MSG;
let _status_code = _constant.FINAL_STATUS_CODE;

export default
  {
    OTP_Generate()
    {
      var len = _otp_parameter.LEN;
      const characters = _otp_parameter.NUM;
      let otp_result = '';
      const charactersLength = characters.length;
      for (let i = 0; i < len; i++) 
      {
        otp_result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return otp_result;
    },

    Gen_invite_code()
    {
      var len = _otp_parameter.LEN;
      const characters = _otp_parameter.CODE;
      let code_result = '';
      const charactersLength = characters.length;
      for (let i = 0; i < len; i++) 
      {
        code_result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return code_result;
    },

    Gen_auth_token()
    {
      var len = _otp_parameter.CHAR_LEN;
      const characters = _otp_parameter.CHAR;
      let token_result = '';
      const charactersLength = characters.length;
      for (let i = 0; i < len; i++) 
      {
        token_result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return token_result;
    },
    // {
    //   console.log("CHECK:");
    //   let final_imagePath = "";
    //   if (req.files == null && req.files == "")
    //   {
    //     return next(new Error("Bad request"));
    //   }
    //   else
    //   {
    //     var image = req.files;
    //     const array_of_allowed_files = ['png', 'jpeg', 'jpg', 'PNG', 'JPEG', 'JPG'];
    //     const array_of_allowed_file_types = ['image/png', 'image/jpeg', 'image/jpg'];

    //     // Allowed file size in mb
    //     const allowed_file_size = 2;

    //     const file_extension = image.originalname.slice(
    //       ((image.originalname.lastIndexOf('.') - 1) >>> 0) + 2
    //     );

    //     // Check if the uploaded file is allowed
    //     //|| !array_of_allowed_file_types.includes(image.memetype)
    //     if (!array_of_allowed_files.includes(file_extension) || !array_of_allowed_file_types.includes(image.mimetype))
    //     {
    //       return next(new Error("Invalid Image file"));
    //     }
    //     else if ((image.size / (1024 * 1024)) > allowed_file_size)
    //     {
    //       return next(new Error("File too large"));
    //     }
    //     else
    //     {
    //       //profile_url = `http://192.168.29.7:3000/src/Images/Customer_Images/${req.file.filename}`;
    //       final_imagePath = `${req.files.name}`;
    //       return final_imagePath;
    //     }
    //   }
    // },

    uploadToCloudinary: async (filePath) =>
    {
      try
      {
        if (!filePath)
        {
          throw new Error('Invalid file path');
        }

        // Check if the file exists
        await fs.access(filePath);

        // Upload the file to Cloudinary
        const result = await new Promise((resolve, reject) =>
        {
          cloudinary.uploader.upload(filePath,
            { folder: 'product' },
            (error, result) =>
            {
              if (error) reject(error);
              else resolve(result);
            }
          );
        });
        return result.secure_url;
      } catch (error)
      {
        console.error('Error in uploadToCloudinary:', error);
        throw error;
      }
    },

    uploadFileS: async (file, pathD) =>
    {
      try
      {
        if (file == undefined || file == null)
        {
          throw new Error('No file provided');
        }
        const extensionName = path.extname(file.name);
        const sampleFile = crypto.randomBytes(16).toString("hex") + extensionName;

        // Construct the upload path
        const uploadPath = path.join('public', 'uploads', pathD, sampleFile);
        const fullUploadPath = path.join(process.cwd(), uploadPath);

        // Ensure the directory exists
        await fs.mkdir(path.dirname(fullUploadPath), { recursive: true });

        // Move the file
        await fs.writeFile(fullUploadPath, file.data);

        // Return the path relative to the project root
        return path.join('public', 'uploads', pathD, sampleFile);
      } catch (err)
      {
        console.error("Error saving to local storage:", err);
        throw err;
      }
    },

    saveErrorLog: (_fileName, _funName, _errorMsg, _reqJson) =>
    {
      let myreqJSON = JSON.stringify(_reqJson.body);
      // console.log(_reqJson.body);
      if (_errorMsg > 1000)
      {
        //let text = "Hello world!";
        _errorMsg = _errorMsg.substring(0, 999);
      }
      if (myreqJSON > 5000)
      {
        myreqJSON = myreqJSON.substring(0, 4999);
      }
      var _query = `INSERT INTO ${api_error_log_detail.TABLE}
      (
      ${api_error_log_detail.FIELDS.FILE_NAME},
      ${api_error_log_detail.FIELDS.METHOD_NAME},
      ${api_error_log_detail.FIELDS.ERROR},
      ${api_error_log_detail.FIELDS.ERROR_JSON})
      VALUES('${_fileName}','${_funName}',"${_errorMsg}",'${myreqJSON}')`;
      _dbhelper.InsertQueryErrorLog(_query);
      return _query;
    },

    async send_notification(
      uids,
      title,
      message,
      type,
      type_id = null,
      payload = null,
      sub_type,
      send_by
    )
    {
      try
      {
        //console.log("PAYLOAD:", payload);
        const query = await this.select(
          `SELECT fcm_token FROM fcm_token WHERE u_id IN (${uids})`
        );

        if (query.length > 0)
        {
          //console.log("TOKEN:", )
          //generate access token using google-apis & service account json file
          const { client_email, private_key, project_id } = serviceAccount;
          const jwtClient = new google.auth.JWT(
            client_email,
            null,
            private_key,
            ["https://www.googleapis.com/auth/cloud-platform"],
            null
          );
          const tokens = await jwtClient.authorize();
          const access_token = tokens.access_token;

          //console.log("TOKEN:", access_token);
          for (let i = 0; i < query.length; i++)
          {
            //console.log("FCM_TOKEN:", query[i].fcm_token);
            const obj = {
              message: {
                token: `${query[i].fcm_token}`,
                notification: {
                  title: title,
                  body: message,
                },
                data: {
                  sound: "default",
                  type: `${type}`,
                  type_id: `${type_id}`,
                  payload: `${JSON.stringify(payload)}`,
                }, android: {
                  notification: {
                    sound: 'default'
                  },
                },
                apns: {
                  payload: {
                    aps: {
                      sound: 'default'
                    },
                  },
                },
              },
            };

            //send notification using http v1 api firebase
            const options = {
              url: `https://fcm.googleapis.com/v1/projects/${project_id}/messages:send`,
              method: "POST",
              maxBodyLength: Infinity,
              headers: {
                "Content-Type": `application/json`,
                Authorization: `Bearer ${access_token}`,
              },
              rejectUnauthorized: false,
              data: obj,
            };

            await axios.request(options)
              .then(response =>
              {
                //console.log(`Device SUCCESS`, response.status);
              })
              .catch(error =>
              {
                //console.log(`Device FAILED:`, error.response.status);
              });
          }
          await this.insert(
            `INSERT INTO notification(user_id,title,description,type,type_id,status)VALUES(?,?,?,?,?,?)`,
            [uids, title, message, type, type_id, 1]
          );
          return true;
        }
        else
        {
          return false;
        }
      }
      catch (err)
      {
        this.err = err;
        console.log("Error:", err.message);
      }
    },

    // -----------------------------Subscribe Token----------------------------
    async send_notification_to_topic(topic, title, message, type, type_id = null, send_by, payload = null) 
    {
      try
      {
        // Generate access token using Google APIs & service account JSON file
        const { client_email, private_key, project_id } = serviceAccount;

        const jwtClient = new google.auth.JWT(
          client_email,
          null,
          private_key,
          ["https://www.googleapis.com/auth/cloud-platform"],
          null
        );
        const tokens = await jwtClient.authorize();
        const access_token = tokens.access_token;

        let data = JSON.stringify({
          "message": {
            "topic": `${topic}`,
            "notification": {
              "title": `${title}`,
              "body": `${message}`
            },
            "data": {
              "sound": "default",
              "type": `${type}`,
              "type_id": `${type_id}`,
              "payload": `${payload}`
            }, "android": {
              "notification": {
                "sound": "default"
              },
            }, "apns": {
              "payload": {
                "aps": {
                  "sound": "default"
                },
              },
            },
          }
        });

        // Send notification using HTTP v1 API Firebase
        const options = {
          url: `https://fcm.googleapis.com/v1/projects/${project_id}/messages:send`,
          method: "POST",
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": `application/json`,
            Authorization: `Bearer ${access_token}`,
          },
          rejectUnauthorized: false,
          data: data,
        };

        let result = await axios.request(options);

        if (result.status == 200)
        {
          await this.insert(
            `INSERT INTO notification(user_id,title,description,type,type_id,status)VALUES(?,?,?,?,?,?)`,
            [0, title, message, type, type_id, 1]
          );
          return result;
        }
        else
        {
          return false;
        }
      }
      catch (err)
      {
        // Handle errors
        console.log(err.message);
        //console.log("ERR", err);
        return false;
      }
    },

    async payment_cancel_refund(payment_id)
    {
      try
      {
        let secret_key = common.STRIPE.SECRET_KEY;
        const obj = { "payment_intent": payment_id };
        //payment refund initiated...
        const options = {
          url: `https://api.stripe.com/v1/refunds`,
          method: "POST",
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": `application/x-www-form-urlencoded`,
            Authorization: `Bearer ${secret_key}`,
          },
          data: obj,
        };
        const response = await axios.request(options);
        return response;
      }
      catch (error)
      {
        console.error('Error processing refund:', error.response ? error.response.data : error.message);
        throw error;
      }
    },

    ageCalculator(dob)
    {
      try
      {

        var today = new Date();
        var birthDate = new Date(dob);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
        {
          age--;
        }

        return age;
      }
      catch (err)
      {
        console.log(err.message);
        return 0;
      }
    },

    calculateAveragePoint(rating)
    {
      const points = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
      let nearestPoint = points[0];
      let smallestDifference = Math.abs(rating - nearestPoint);

      for (let i = 1; i < points.length; i++) 
      {
        const difference = Math.abs(rating - points[i]);
        if (difference < smallestDifference) 
        {
          nearestPoint = points[i];
          smallestDifference = difference;
        }
      }
      return nearestPoint;
    },

    mail_template(email, body, type)
    {
      //console.log("body:", body.name);
      //type = 1 --> contact us template
      //type = 2 --> trainer signup template
      //type = 3 --> sign up waiting list template
      if (type == 1)
      {
        return {
          from: {
            name: "Instatrainme",
            address: "instatrainmemarketing@gmail.com",
          }, // Sender address
          to: email, // List of recipents
          subject: "New Contact Request",
          html: `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Request</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333333;
                }
                
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                
                h1 {
                    color: #0077b6;
                    text-align: center;
                }
                
                p {
                    line-height: 1.5;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>New Contact Request</h1>
                <p>Dear Support Team,</p>
                <p>A user has submitted a new contact request through our website. Please find the details below:</p>
                <ul>
                  <li><strong>Name:</strong> ${body.name}</li>
                  <li><strong>Email:</strong> ${body.email}</li>
                  <li><strong>Number:</strong> ${body.number}</li>
                  <li><strong>Website Name:</strong> ${body.website_name}</li>
                  <li><strong>Subject:</strong> ${body.subject}</li>
                  <li><strong>Query:</strong> ${body.query}</li>
                  <li><strong>Message:</strong> ${body.message}</li>
                </ul>
                <p>Please review the request and respond accordingly.</p>
                <p>Best regards,<br>Instatrainme</p>
            </div>
        </body>
        </html>
        `,
        }
      }
      else if (type == 2)
      {
        return {
          from: {
            name: "Instatrainme",
            address: "instatrainmemarketing@gmail.com",
          }, // Sender address
          to: email, // List of recipents
          subject: "New Trainer Signup",
          html: `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Trainer Signup</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333333;
                }
                
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                
                h1 {
                    color: #0077b6;
                    text-align: center;
                }
                
                p {
                    line-height: 1.5;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>New Trainer Signup</h1>
                <p>Dear Support Team,</p>
                <p>A new trainer has signed up on our portal. Please find their details below:</p>
                <ul>
                    <li><strong>Name:</strong> ${name}</li>
                </ul>
                <p>Please review their information and take necessary actions.</p>
                <p>Best regards,<br>Instatrainme</p>
            </div>
        </body>
        </html>
        `,
        }
      }
      else if (type == 3)
      {
        return {
          from: {
            name: "Instatrainme",
            address: "instatrainmemarketing@gmail.com",
          }, // Sender address
          to: email, // List of recipents
          subject: "New user signup",
          html: `
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Signup Process</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333333;
                }
                
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                
                h1 {
                    color: #0077b6;
                    text-align: center;
                }
                
                p {
                    line-height: 1.5;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>New User Signup</h1>
                <p>Dear ${body.name},</p>
                <p>Please be patient, and we will notify you as soon as our application is ready.</p>
                <ul>
                  <li><strong>Name:</strong> ${body.name}</li>
                  <li><strong>Email:</strong> ${body.email}</li>
                </ul>
                <p>In the meantime, if you have any questions or concerns, please feel free to reach out to our support team.</p>
                <p>Best regards,<br>Instatrainme</p>
            </div>
        </body>
        </html>
        `,
        }
      }
      else if (type == 4)
      {
        let fp_token = body.fp_token;
        let page_link = "https://devapi.instatrainme.com/forgot-password/?fp_token=" + fp_token;
        return {
          from: {
            name: "Instatrainme",
            address: "instatrainmemarketing@gmail.com",
          }, // Sender address
          to: email, // List of recipents
          subject: "Reset your password for Instatrainme",
          html: `
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New User Inquiry</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f7f7f7;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 10px;
              box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            }
            .header {
              background-color: #60c2e9;
              color: #fff;
              padding: 20px;
              text-align: center;
              border-top-left-radius: 10px;
              border-top-right-radius: 10px;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 2px;
            }
            .content {
              padding: 20px;
            }
            .content p {
              margin: 15px 0;
              line-height: 1.5;
            }
            .footer {
              background-color: #f7f7f7;
              padding: 15px;
              text-align: center;
              border-bottom-left-radius: 10px;
              border-bottom-right-radius: 10px;
              font-size: 14px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Instatrainme</h1>
            </div>
            <div class="content">
              <br>
              <h2>Forgot your password? Let's get you a new one.</h2>
              We got a request to change the password for the account with the email.
              <br><b>${email}</b>
              <br><br>
              If you don't want to reset your password, you can ignore this email.
              <br><br>
              <div>
                <a href="${page_link}" style="background-color: #60c2e9;border-radius:4px;color:#FFFFFF;display:inline-block;font-family:sans-serif;font-size:13px;font-weight:bold;line-height:40px;text-align:center;text-decoration:none;width:150px;-webkit-text-size-adjust:none;">Reset your password</a>
              </div>
            </div>
            <div class="footer">
              <p>Thank you,<br>The Support Team</p>
            </div>
          </div>
        </body>
        </html>`,
        }
      }
    },

    generate_password(data) 
    {
      return crypto.createHmac("sha256", "qwerty").update(data).digest("hex");
    },

    check_password(hex, data) 
    {
      return (
        crypto.createHmac("sha256", "qwerty").update(data).digest("hex") === hex
      );
    },

    random_string() 
    {
      return crypto.randomBytes(16).toString("hex");
    },

    // generate apikey
    generate_apikey(user_id)
    {
      return crypto
        .createHmac("sha256", "courtdocs")
        .update(user_id.toString())
        .digest("hex");
    },

    // generate token
    generate_token(user_id)
    {
      return crypto
        .createHmac("md5", "amityadav")
        .update(user_id.toString())
        .digest("hex");
    },

  };