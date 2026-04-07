import sgMail from "@sendgrid/mail";
import dotenv from "dotenv"

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, data) => {
  try {
    const msg = {
      to,
      subject,
      from: process.env.EMAIL_FROM,
      templateId: process.env.SENDGRID_TEMPLATE_ID,
      dynamicTemplateData: data,
    };

    const response = await sgMail.send(msg);

    console.log("Email sent:", response[0].statusCode);
    return true;
  } catch (error) {
    console.error(" Email error:", error.response?.body || error.message);

    return false; 
  }
};









// import sgMail from "@sendgrid/mail";

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// export const sendEmail = async (to, subject, html) => {
//   try {
//     const msg = {
//       to:"smitbhimani002@gmail.com",
//       from: process.env.EMAIL_FROM,
//       subject:"test email",
//       html:"hello "
//     };

//     const response = await sgMail.send(msg);

//     console.log("Email sent:", response[0].statusCode);
//     return true;
//   } catch (error) {
//     console.error(" Email error:", error.response?.body || error.message);

//     return false; // fail
//   }
// };
