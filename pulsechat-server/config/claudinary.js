import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
  api_key    : process.env.CLOUDINARY_API_KEY,
  api_secret : process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (base64Image, folder = "pulsechat") => {
  const result = await cloudinary.uploader.upload(base64Image, {
    folder,
    resource_type: "auto",
    transformation: [{ width: 500, height: 500, crop: "limit", quality: "auto" }],
  });
  return result.secure_url;
};

export const deleteImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

export default cloudinary;