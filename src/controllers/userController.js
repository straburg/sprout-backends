import { dbServices, availableEmail, verifyEmail, clearTestDatas } from "../services/userServices";
import { sendingMails } from "../services/mail";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
//import moment from "moment";
import { errorResponse, successResponse, today } from "../helpers";

module.exports = {
    test: (req = null, res) => {
        res.status(200).send(successResponse("welcome to scrib server"))
    },
    signup: (req, res, next) => {
        console.log("signup");
        const { name,gender,country,address,occupation,status,email,password,phone,username,idcard,bank } = req.body;
        let arr = Math.floor(1000000000 + Math.random() * 9000000000);
        async function sendToDb() {
            try {

                let preparedQuery = "insert into users (name, gender, country,address,occupation,status, email, password,balance, idcard, created_at, phone, acctnumber, username,bank) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *";
                let queryParams = [name, gender, country, address,occupation,status, email, password, 0,idcard, today(0, true),phone,arr,username,bank];
                let result = await dbServices(preparedQuery, queryParams);
                result = result[0];
                result.token = jwt.sign({ user: result }, "ourlittlesecret", {});
                req.bankName = bank
                req.acct = arr;
                req.newDetails = result;
                //console.log(result);
                //res.status(201).send(successResponse("Account created successfully", result));
                next()
            } catch (e) {
                res.status(406).send(errorResponse(e));
            }
        }
        sendToDb()
    },
    sendEmail: (req, res, next) => {
        const { email, name } = req.body;
        const { acct, newDetails, bankName } = req;
        async function sendmail() {
			try {
				let mailOptions = {
					from: bankName === "sproutbg" ? "Sprout Groups" : "Western Prime Crest",
					to: email,
					subject: 'Registration Successful',
					html: `
                    <!doctype html>
                    <html>
                      <head>
                        <meta name="viewport" content="width=device-width" />
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                        <title>Simple Transactional Email</title>
                        <style>
                          /* -------------------------------------
                              GLOBAL RESETS
                          ------------------------------------- */
                          
                          /*All the styling goes here*/
                          
                          img {
                            border: none;
                            -ms-interpolation-mode: bicubic;
                            max-width: 100%; 
                          }
                    
                          body {
                            background-color: #f6f6f6;
                            font-family: sans-serif;
                            -webkit-font-smoothing: antialiased;
                            font-size: 14px;
                            line-height: 1.4;
                            margin: 0;
                            padding: 0;
                            -ms-text-size-adjust: 100%;
                            -webkit-text-size-adjust: 100%; 
                          }
                    
                          table {
                            border-collapse: separate;
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            width: 100%; }
                            table td {
                              font-family: sans-serif;
                              font-size: 14px;
                              vertical-align: top; 
                          }
                    
                          /* -------------------------------------
                              BODY & CONTAINER
                          ------------------------------------- */
                    
                          .body {
                            background-color: #f6f6f6;
                            width: 100%; 
                          }
                    
                          /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
                          .container {
                            display: block;
                            margin: 0 auto !important;
                            /* makes it centered */
                            max-width: 580px;
                            padding: 10px;
                            width: 580px; 
                          }
                    
                          /* This should also be a block element, so that it will fill 100% of the .container */
                          .content {
                            box-sizing: border-box;
                            display: block;
                            margin: 0 auto;
                            max-width: 580px;
                            padding: 10px; 
                          }
                    
                          /* -------------------------------------
                              HEADER, FOOTER, MAIN
                          ------------------------------------- */
                          .main {
                            background: #ffffff;
                            border-radius: 3px;
                            width: 100%; 
                          }
                    
                          .wrapper {
                            box-sizing: border-box;
                            padding: 20px; 
                          }
                    
                          .content-block {
                            padding-bottom: 10px;
                            padding-top: 10px;
                          }
                    
                          .footer {
                            clear: both;
                            margin-top: 10px;
                            text-align: center;
                            width: 100%; 
                          }
                            .footer td,
                            .footer p,
                            .footer span,
                            .footer a {
                              color: #999999;
                              font-size: 12px;
                              text-align: center; 
                          }
                    
                          /* -------------------------------------
                              TYPOGRAPHY
                          ------------------------------------- */
                          h1,
                          h2,
                          h3,
                          h4 {
                            color: #000000;
                            font-family: sans-serif;
                            font-weight: 400;
                            line-height: 1.4;
                            margin: 0;
                            margin-bottom: 30px; 
                          }
                    
                          h1 {
                            font-size: 35px;
                            font-weight: 300;
                            text-align: center;
                            text-transform: capitalize; 
                          }
                    
                          p,
                          ul,
                          ol {
                            font-family: sans-serif;
                            font-size: 14px;
                            font-weight: normal;
                            margin: 0;
                            margin-bottom: 15px; 
                          }
                            p li,
                            ul li,
                            ol li {
                              list-style-position: inside;
                              margin-left: 5px; 
                          }
                    
                          a {
                            color: #3498db;
                            text-decoration: underline; 
                          }
                    
                          /* -------------------------------------
                              BUTTONS
                          ------------------------------------- */
                          .btn {
                            box-sizing: border-box;
                            width: 100%; }
                            .btn > tbody > tr > td {
                              padding-bottom: 15px; }
                            .btn table {
                              width: auto; 
                          }
                            .btn table td {
                              background-color: #ffffff;
                              border-radius: 5px;
                              text-align: center; 
                          }
                            .btn a {
                              background-color: #ffffff;
                              border: solid 1px #3498db;
                              border-radius: 5px;
                              box-sizing: border-box;
                              color: #3498db;
                              cursor: pointer;
                              display: inline-block;
                              font-size: 14px;
                              font-weight: bold;
                              margin: 0;
                              padding: 12px 25px;
                              text-decoration: none;
                              text-transform: capitalize; 
                          }
                    
                          .btn-primary table td {
                            background-color: #3498db; 
                          }
                    
                          .btn-primary a {
                            background-color: #3498db;
                            border-color: #3498db;
                            color: #ffffff; 
                          }
                    
                          /* -------------------------------------
                              OTHER STYLES THAT MIGHT BE USEFUL
                          ------------------------------------- */
                          .last {
                            margin-bottom: 0; 
                          }
                    
                          .first {
                            margin-top: 0; 
                          }
                    
                          .align-center {
                            text-align: center; 
                          }
                    
                          .align-right {
                            text-align: right; 
                          }
                    
                          .align-left {
                            text-align: left; 
                          }
                    
                          .clear {
                            clear: both; 
                          }
                    
                          .mt0 {
                            margin-top: 0; 
                          }
                    
                          .mb0 {
                            margin-bottom: 0; 
                          }
                    
                          .preheader {
                            color: transparent;
                            display: none;
                            height: 0;
                            max-height: 0;
                            max-width: 0;
                            opacity: 0;
                            overflow: hidden;
                            mso-hide: all;
                            visibility: hidden;
                            width: 0; 
                          }
                    
                          .powered-by a {
                            text-decoration: none; 
                          }
                    
                          hr {
                            border: 0;
                            border-bottom: 1px solid #f6f6f6;
                            margin: 20px 0; 
                          }
                    
                          /* -------------------------------------
                              RESPONSIVE AND MOBILE FRIENDLY STYLES
                          ------------------------------------- */
                          @media only screen and (max-width: 620px) {
                            table[class=body] h1 {
                              font-size: 28px !important;
                              margin-bottom: 10px !important; 
                            }
                            table[class=body] p,
                            table[class=body] ul,
                            table[class=body] ol,
                            table[class=body] td,
                            table[class=body] span,
                            table[class=body] a {
                              font-size: 16px !important; 
                            }
                            table[class=body] .wrapper,
                            table[class=body] .article {
                              padding: 10px !important; 
                            }
                            table[class=body] .content {
                              padding: 0 !important; 
                            }
                            table[class=body] .container {
                              padding: 0 !important;
                              width: 100% !important; 
                            }
                            table[class=body] .main {
                              border-left-width: 0 !important;
                              border-radius: 0 !important;
                              border-right-width: 0 !important; 
                            }
                            table[class=body] .btn table {
                              width: 100% !important; 
                            }
                            table[class=body] .btn a {
                              width: 100% !important; 
                            }
                            table[class=body] .img-responsive {
                              height: auto !important;
                              max-width: 100% !important;
                              width: auto !important; 
                            }
                          }
                    
                          /* -------------------------------------
                              PRESERVE THESE STYLES IN THE HEAD
                          ------------------------------------- */
                          @media all {
                            .ExternalClass {
                              width: 100%; 
                            }
                            .ExternalClass,
                            .ExternalClass p,
                            .ExternalClass span,
                            .ExternalClass font,
                            .ExternalClass td,
                            .ExternalClass div {
                              line-height: 100%; 
                            }
                            .apple-link a {
                              color: inherit !important;
                              font-family: inherit !important;
                              font-size: inherit !important;
                              font-weight: inherit !important;
                              line-height: inherit !important;
                              text-decoration: none !important; 
                            }
                            #MessageViewBody a {
                              color: inherit;
                              text-decoration: none;
                              font-size: inherit;
                              font-family: inherit;
                              font-weight: inherit;
                              line-height: inherit;
                            }
                            .btn-primary table td:hover {
                              background-color: #34495e !important; 
                            }
                            .btn-primary a:hover {
                              background-color: #34495e !important;
                              border-color: #34495e !important; 
                            } 
                          }
                    
                        </style>
                      </head>
                      <body class="">
                        <span class="preheader">Registration Successful</span>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
                          <tr>
                            <td>&nbsp;</td>
                            <td class="container">
                              <div class="content">
                    
                                <!-- START CENTERED WHITE CONTAINER -->
                                <table role="presentation" class="main">
                    
                                  <!-- START MAIN CONTENT AREA -->
                                  <tr>
                                    <td class="wrapper">
                                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                          <td>
                                            <p>Hi there,</p>
                                            <p><h3>WELCOME ${name}</h3></p>
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                                              <tbody>
                                                <tr>
                                                  <td align="left">
                                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                        <tr>
                                                          <td> <a href=${bankName === "sproutbg" ? "http://sproutgroups.com" : "http://htmlemail.io"} target="_blank">Sign In</a> </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                            <p>Account number${acct}<p>
                                            <p>From all of us at ${bankName}.</p>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                    
                                <!-- END MAIN CONTENT AREA -->
                                </table>
                                <!-- END CENTERED WHITE CONTAINER -->
                    
                                <!-- START FOOTER -->
                                <div class="footer">
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td class="content-block">
                                        <span class="apple-link">Company Inc, 3 ${bankName} Road, San Francisco CA 94102</span>
                                        <br> Don't like these emails? <a href="http://i.imgur.com/CScmqnj.gif">Unsubscribe</a>.
                                      </td>
                                    </tr>
                                    
                                  </table>
                                </div>
                                <!-- END FOOTER -->
                    
                              </div>
                            </td>
                            <td>&nbsp;</td>
                          </tr>
                        </table>
                      </body>
                    </html>
                    © 2020 ${bankName}, Inc.
                    Terms
                    Privacy
                    Security
                    Status
                    Help
                    Contact ${bankName}
                    Blog
                    About`
				};
                let successfull = await sendingMails(mailOptions);
                console.log("sendEmail");
                res.status(201).send(successResponse("Account created successfully", newDetails));
			} catch (err) {
                console.log(err);
                res.status(201).send(successResponse("Account created successfully", newDetails));
			}
		}
		sendmail();
    },
    sendEmailNotice: (req, res) => {
        const { recipient, title, emailbody, bankName } = req.body;
         console.log("receiver:",recipient);
        async function sendmail() {
			try {
				let mailOptions = {
					from: `${bankName}  Groups`,
					to: recipient,
					subject: title,
                    html: `
                    <!doctype html>
                    <html>
                      <head>
                        <meta name="viewport" content="width=device-width" />
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                        <title>Simple Transactional Email</title>
                        <style>
                          /* -------------------------------------
                              GLOBAL RESETS
                          ------------------------------------- */
                          
                          /*All the styling goes here*/
                          
                          img {
                            border: none;
                            -ms-interpolation-mode: bicubic;
                            max-width: 100%; 
                          }
                    
                          body {
                            background-color: #f6f6f6;
                            font-family: sans-serif;
                            -webkit-font-smoothing: antialiased;
                            font-size: 14px;
                            line-height: 1.4;
                            margin: 0;
                            padding: 0;
                            -ms-text-size-adjust: 100%;
                            -webkit-text-size-adjust: 100%; 
                          }
                    
                          table {
                            border-collapse: separate;
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                            width: 100%; }
                            table td {
                              font-family: sans-serif;
                              font-size: 14px;
                              vertical-align: top; 
                          }
                    
                          /* -------------------------------------
                              BODY & CONTAINER
                          ------------------------------------- */
                    
                          .body {
                            background-color: #f6f6f6;
                            width: 100%; 
                          }
                    
                          /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
                          .container {
                            display: block;
                            margin: 0 auto !important;
                            /* makes it centered */
                            max-width: 580px;
                            padding: 10px;
                            width: 580px; 
                          }
                    
                          /* This should also be a block element, so that it will fill 100% of the .container */
                          .content {
                            box-sizing: border-box;
                            display: block;
                            margin: 0 auto;
                            max-width: 580px;
                            padding: 10px; 
                          }
                    
                          /* -------------------------------------
                              HEADER, FOOTER, MAIN
                          ------------------------------------- */
                          .main {
                            background: #ffffff;
                            border-radius: 3px;
                            width: 100%; 
                          }
                    
                          .wrapper {
                            box-sizing: border-box;
                            padding: 20px; 
                          }
                    
                          .content-block {
                            padding-bottom: 10px;
                            padding-top: 10px;
                          }
                    
                          .footer {
                            clear: both;
                            margin-top: 10px;
                            text-align: center;
                            width: 100%; 
                          }
                            .footer td,
                            .footer p,
                            .footer span,
                            .footer a {
                              color: #999999;
                              font-size: 12px;
                              text-align: center; 
                          }
                    
                          /* -------------------------------------
                              TYPOGRAPHY
                          ------------------------------------- */
                          h1,
                          h2,
                          h3,
                          h4 {
                            color: #000000;
                            font-family: sans-serif;
                            font-weight: 400;
                            line-height: 1.4;
                            margin: 0;
                            margin-bottom: 30px; 
                          }
                    
                          h1 {
                            font-size: 35px;
                            font-weight: 300;
                            text-align: center;
                            text-transform: capitalize; 
                          }
                    
                          p,
                          ul,
                          ol {
                            font-family: sans-serif;
                            font-size: 14px;
                            font-weight: normal;
                            margin: 0;
                            margin-bottom: 15px; 
                          }
                            p li,
                            ul li,
                            ol li {
                              list-style-position: inside;
                              margin-left: 5px; 
                          }
                    
                          a {
                            color: #3498db;
                            text-decoration: underline; 
                          }
                    
                          /* -------------------------------------
                              BUTTONS
                          ------------------------------------- */
                          .btn {
                            box-sizing: border-box;
                            width: 100%; }
                            .btn > tbody > tr > td {
                              padding-bottom: 15px; }
                            .btn table {
                              width: auto; 
                          }
                            .btn table td {
                              background-color: #ffffff;
                              border-radius: 5px;
                              text-align: center; 
                          }
                            .btn a {
                              background-color: #ffffff;
                              border: solid 1px #3498db;
                              border-radius: 5px;
                              box-sizing: border-box;
                              color: #3498db;
                              cursor: pointer;
                              display: inline-block;
                              font-size: 14px;
                              font-weight: bold;
                              margin: 0;
                              padding: 12px 25px;
                              text-decoration: none;
                              text-transform: capitalize; 
                          }
                    
                          .btn-primary table td {
                            background-color: #3498db; 
                          }
                    
                          .btn-primary a {
                            background-color: #3498db;
                            border-color: #3498db;
                            color: #ffffff; 
                          }
                    
                          /* -------------------------------------
                              OTHER STYLES THAT MIGHT BE USEFUL
                          ------------------------------------- */
                          .last {
                            margin-bottom: 0; 
                          }
                    
                          .first {
                            margin-top: 0; 
                          }
                    
                          .align-center {
                            text-align: center; 
                          }
                    
                          .align-right {
                            text-align: right; 
                          }
                    
                          .align-left {
                            text-align: left; 
                          }
                    
                          .clear {
                            clear: both; 
                          }
                    
                          .mt0 {
                            margin-top: 0; 
                          }
                    
                          .mb0 {
                            margin-bottom: 0; 
                          }
                    
                          .preheader {
                            color: transparent;
                            display: none;
                            height: 0;
                            max-height: 0;
                            max-width: 0;
                            opacity: 0;
                            overflow: hidden;
                            mso-hide: all;
                            visibility: hidden;
                            width: 0; 
                          }
                    
                          .powered-by a {
                            text-decoration: none; 
                          }
                    
                          hr {
                            border: 0;
                            border-bottom: 1px solid #f6f6f6;
                            margin: 20px 0; 
                          }
                    
                          /* -------------------------------------
                              RESPONSIVE AND MOBILE FRIENDLY STYLES
                          ------------------------------------- */
                          @media only screen and (max-width: 620px) {
                            table[class=body] h1 {
                              font-size: 28px !important;
                              margin-bottom: 10px !important; 
                            }
                            table[class=body] p,
                            table[class=body] ul,
                            table[class=body] ol,
                            table[class=body] td,
                            table[class=body] span,
                            table[class=body] a {
                              font-size: 16px !important; 
                            }
                            table[class=body] .wrapper,
                            table[class=body] .article {
                              padding: 10px !important; 
                            }
                            table[class=body] .content {
                              padding: 0 !important; 
                            }
                            table[class=body] .container {
                              padding: 0 !important;
                              width: 100% !important; 
                            }
                            table[class=body] .main {
                              border-left-width: 0 !important;
                              border-radius: 0 !important;
                              border-right-width: 0 !important; 
                            }
                            table[class=body] .btn table {
                              width: 100% !important; 
                            }
                            table[class=body] .btn a {
                              width: 100% !important; 
                            }
                            table[class=body] .img-responsive {
                              height: auto !important;
                              max-width: 100% !important;
                              width: auto !important; 
                            }
                          }
                    
                          /* -------------------------------------
                              PRESERVE THESE STYLES IN THE HEAD
                          ------------------------------------- */
                          @media all {
                            .ExternalClass {
                              width: 100%; 
                            }
                            .ExternalClass,
                            .ExternalClass p,
                            .ExternalClass span,
                            .ExternalClass font,
                            .ExternalClass td,
                            .ExternalClass div {
                              line-height: 100%; 
                            }
                            .apple-link a {
                              color: inherit !important;
                              font-family: inherit !important;
                              font-size: inherit !important;
                              font-weight: inherit !important;
                              line-height: inherit !important;
                              text-decoration: none !important; 
                            }
                            #MessageViewBody a {
                              color: inherit;
                              text-decoration: none;
                              font-size: inherit;
                              font-family: inherit;
                              font-weight: inherit;
                              line-height: inherit;
                            }
                            .btn-primary table td:hover {
                              background-color: #34495e !important; 
                            }
                            .btn-primary a:hover {
                              background-color: #34495e !important;
                              border-color: #34495e !important; 
                            } 
                          }
                    
                        </style>
                      </head>
                      <body class="">
                        <span class="preheader">Notification from ${bankName} Groups</span>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
                          <tr>
                            <td>&nbsp;</td>
                            <td class="container">
                              <div class="content">
                    
                                <!-- START CENTERED WHITE CONTAINER -->
                                <table role="presentation" class="main">
                    
                                  <!-- START MAIN CONTENT AREA -->
                                  <tr>
                                    <td class="wrapper">
                                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                        <tr>
                                          <td>
                                            <p>Hi there,</p>
                                            <p>${title}</p>
                                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                                              <tbody>
                                                <tr>
                                                  <td align="left">
                                                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                                      <tbody>
                                                        <tr>
                                                          <td> <a href=${bankName === "sproutbg" ? "http://sproutgroups.com" : "http://htmlemail.io"} target="_blank">Sign In</a> </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                            <p>${emailbody}.</p>
                                            <p>From all of us at ${bankName}.</p>
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </tr>
                    
                                <!-- END MAIN CONTENT AREA -->
                                </table>
                                <!-- END CENTERED WHITE CONTAINER -->
                    
                                <!-- START FOOTER -->
                                <div class="footer">
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                    <tr>
                                      <td class="content-block">
                                        <span class="apple-link">Company Inc, 3 ${bankName} Road, San Francisco CA 94102</span>
                                        <br> Don't like these emails? <a href="http://i.imgur.com/CScmqnj.gif">Unsubscribe</a>.
                                      </td>
                                    </tr>
                                    
                                  </table>
                                </div>
                                <!-- END FOOTER -->
                    
                              </div>
                            </td>
                            <td>&nbsp;</td>
                          </tr>
                        </table>
                      </body>
                    </html>
                    © 2020 ${bankName}, Inc.
                    Terms
                    Privacy
                    Security
                    Status
                    Help
                    Contact ${bankName}
                    Blog
                    About
                    `
				};
                let successfull = await sendingMails(mailOptions);
                console.log("sendEmail");
                res.status(201).send(successResponse("Email Sent Successfull", successfull));
			} catch (err) {
                console.log(err);
                res.status(400).send(errorResponse(err));
			}
		}
		sendmail();
    },
    validateEmail: (req, res, next) => {
        console.log("validateEmail");
        const { email, userid } = req.body;
        async function validateUniqueEmail() {
            try {
                let preparedQuery = "select * from users where CASE WHEN $1::varchar IS NOT NULL THEN email = $1 ELSE 1=1 END  and CASE "
                    + " WHEN $2::int IS NOT NULL THEN id <> $2 ELSE 1=1 END";
                let queryParams = [email, userid];
                let emailValid = await availableEmail(preparedQuery, queryParams);
                next();
            } catch (e) {
                res.status(400).send(errorResponse(e));
            }
        }
        validateUniqueEmail();
    },
    validateUsername: (req, res, next) => {
        console.log("validateUsername");
        const { username, userid } = req.body;
        async function validateUniqueEmail() {
            try {
                let preparedQuery = "select * from users where CASE WHEN $1::varchar IS NOT NULL THEN username = $1 ELSE 1=1 END  and CASE "
                    + " WHEN $2::int IS NOT NULL THEN id <> $2 ELSE 1=1 END";
                let queryParams = [username, userid];
                let emailValid = await availableEmail(preparedQuery, queryParams);
                next();
            } catch (e) {
                res.status(400).send(errorResponse(e));
            }
        }
        validateUniqueEmail();
    },
    login: (req, res, next) => {
        const { email, password, bank } = req.body;
        async function loginUser() {
            try {
                let preparedQuery = "select * from users where email = $1 or username = $1";
                let queryParams = [email];
                let result = await verifyEmail(preparedQuery, queryParams);
                result = result[0];
                req.postedPassword = result.password;
                req.resultData = result;
                next();
            } catch (e) {
                res.status(401).send(errorResponse(e));
            }
        }
        loginUser();
    },
    verifyPassword: (req, res, next) => {
        const { postedPassword } = req;
        const { password } = req.body;
        let passwordIsValid = bcrypt.compareSync(password, postedPassword);
        passwordIsValid ? next() : res.status(401).send(errorResponse("Wrong username or password"));


    },
    createToken: (req, res) => {
        const { resultData } = req;
        resultData.token = jwt.sign({ user: resultData }, "ourlittlesecret", {});
        //console.log(resultData);
        resultData.token ?
            res.status(200).send(successResponse("Login successful", resultData))
            :
            res.status(401).send(errorResponse("Unauthorized"));
    },
    clearTestData: (req, res) => {
        async function clearTestDB() {
            try {
                let preparedQuery = "truncate table users restart identity";
                let clearTest = await clearTestDatas(preparedQuery);
                res.status(200).send(successResponse("Login successful", clearTest));
            } catch (e) {
                res.status(401).send(errorResponse(e));
            }
        }
        clearTestDB();

    },
    checkLastUpdate: (req, res, next) => {
        const { name, userid, email } = req.body;
        async function checkEdited() {
            try {
                let preparedQuery = "select * from users where  (name <> $1 or email <> $2) and  (id = $3 and edited_at > $4)";
                let queryParams = [name, email, userid, today(30, false)];
                await availableEmail(preparedQuery, queryParams);

                next();
            } catch (e) {
                res.status(408).send(errorResponse("You changed your name or email not too long ago, please try again after 30 days"));
            }
        }
        checkEdited();
    },
    updatepassword: (req, res) => {
      const { email, newpassword } = req.body;
      async function editProfile() {
        try {
            let preparedQuery = "update users set password = $1 where email = $2 RETURNING *";
            let queryParams = [newpassword , email];

            let result = await dbServices(preparedQuery, queryParams);
            result = result[0];
            //console.log(result);
            res.status(200).send(successResponse("Password changed successfully", result));
        } catch (e) {
            res.status(406).send(errorResponse(e));
        }

    }
    editProfile();
    },

    updateProfile: (req, res) => {
        const { name, gender, country, email, password, userid, usercurrent: { currentName, currentEmail }, usertoken: { tokenName, tokenEmail } } = req.body;
        async function editProfile() {
            try {
                let preparedQuery = currentName === tokenName && currentEmail === tokenEmail ?
                    "update users set name = $1, gender = $2, country = $3, email = $4, password = $5 where id = $6 RETURNING *" :
                    "update users set name = $1, gender = $2, country = $3, email = $4, password = $5,edited_at = $7 where id = $6 RETURNING *";
                let queryParams = currentName === tokenName && currentEmail === tokenEmail ?
                    [name, gender, country, email, password, userid] :
                    [name, gender, country, email, password, userid, today(0, true)];

                let result = await dbServices(preparedQuery, queryParams);
                result = result[0];
                //console.log(result);
                res.status(200).send(successResponse("Profile updated successfully", result));
            } catch (e) {
                res.status(406).send(errorResponse(e));
            }

        }
        editProfile();
    },
    credit: (req, res) => {
        const { amount, bank } = req.body;
        const { userid } = req.params;
        async function editProfile() {
            try {
                let preparedQuery =  "update users set balance = $1, edited_at =$3 where id = $2 and bank = $4 RETURNING *" ;
                let queryParams = [amount, userid, today(0, true), bank ];

                let result = await dbServices(preparedQuery, queryParams);
                result = result[0];
                //console.log(result);
                res.status(200).send(successResponse("User credited successfully", result));
            } catch (e) {
                res.status(406).send(errorResponse(e));
            }

        }
        editProfile();
    },
    getUser: (req, res) => {
        const { userid } = req.params;

        async function getBook() {
            try {
                let preparedQuery = "select *  from users where id=$1";
                let queryParams = [userid];
                let result = await verifyEmail(preparedQuery, queryParams);
                result = result[0];
                res.status(200).send(successResponse("User data", result));
            } catch (e) {
                res.status(404).send(errorResponse("User not found"));
            }

        }
        getBook();
    },
    getBankUser: (req, res) => {
        const { bank } = req.params;

        async function getBook() {
            try {
                let preparedQuery = "select *  from users where bank=$1";
                let queryParams = [bank];
                let result = await dbServices(preparedQuery, queryParams);
                res.status(200).send(successResponse("User data", result));
            } catch (e) {
                res.status(404).send(errorResponse("User not found"));
            }

        }
        getBook();
    }
}