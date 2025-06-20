
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary"; 



cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads", // folder name in Cloudinary
        allowed_formats: ["jpg", "jpeg", "png"],
        transformation: [{ width: 500, height: 500, crop: "limit" }],
    },
});

const upload = multer({ storage });

export default upload;