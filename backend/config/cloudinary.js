import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KYE,
  api_secret: process.env.CLOUD_API_SECRET,
});

console.log("CLOUD NAME:", process.env.CLOUD_NAME);
console.log("API KEY:", process.env.CLOUDINARY_API_KYE);
console.log("API SECRET:", process.env.CLOUD_API_SECRET);
export default cloudinary;
