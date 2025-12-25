import { ID } from "appwrite";
import { storage } from "./appwrite";

const BUCKET_ID = "media";

export const mediaService = {
  // Upload file to Appwrite Storage
  uploadFile: async (file) => {
    try {
      const uploadedFile = await storage.createFile(
        BUCKET_ID,
        ID.unique(),
        file
      );
      
      // Get the preview/view URL
      const fileUrl = storage.getFileView(BUCKET_ID, uploadedFile.$id);
      
      return {
        fileId: uploadedFile.$id,
        fileUrl: fileUrl.href,
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },

  // Upload a blob (for drawings)
  uploadBlob: async (blob, fileName = "drawing.png") => {
    try {
      const file = new File([blob], fileName, { type: "image/png" });
      return await mediaService.uploadFile(file);
    } catch (error) {
      console.error("Error uploading blob:", error);
      throw error;
    }
  },
};
