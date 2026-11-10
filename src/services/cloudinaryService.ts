import crypto from "crypto";
import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

export const uploadImageToCloudinary = (
  buffer: Buffer,
  folder: string,
): Promise<{
  secure_url: string;
  public_id: string;
}> => {
  return new Promise(async (resolve, reject) => {
    try {
      const hash = crypto.createHash("sha256").update(buffer).digest("hex");

      const publicId = `${folder}/${hash}`;

      try {
        const existingImage = await cloudinary.api.resource(publicId, {
          resource_type: "image",
        });

        resolve({
          secure_url: existingImage.secure_url,
          public_id: existingImage.public_id,
        });

        return;
      } catch (error: any) {
        if (error?.error?.http_code !== 404) {
          reject(error);
          return;
        }
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          resource_type: "image",
          overwrite: false,
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(new Error("Cloudinary upload failed"));
            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      );

      Readable.from(buffer).pipe(uploadStream);
    } catch (error) {
      reject(error);
    }
  });
};

export const uploadRemoteImageToCloudinary = async (
  imageUrl: string,
  folder: string,
) => {
  const url = new URL(imageUrl);

  if (
    url.protocol !== "https:" ||
    !(
      url.hostname === "googleusercontent.com" ||
      url.hostname.endsWith(".googleusercontent.com")
    )
  ) {
    throw new Error("Invalid Google profile image URL");
  }

  const response = await fetch(url, {
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error("Failed to download Google profile picture");
  }

  const contentType = response.headers.get("content-type");

  if (!contentType?.startsWith("image/")) {
    throw new Error("Google profile URL did not return an image");
  }

  const imageBuffer = Buffer.from(await response.arrayBuffer());

  if (imageBuffer.length > 5 * 1024 * 1024) {
    throw new Error("Profile picture exceeds the 5 MB limit");
  }

  return uploadImageToCloudinary(imageBuffer, folder);
};
