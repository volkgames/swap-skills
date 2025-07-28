import { env } from "@/env";

const URL = `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/upload`;

export async function uploadFileToBucket(file: File, filename: string) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "profile-images");
  formData.append("public_id", filename);

  try {
    const response = await fetch(URL, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    console.log("data", data);

    if (data.error) {
      throw new Error(data.error.message);
    }

    return data.secure_url;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to upload file to bucket");
  }
}
