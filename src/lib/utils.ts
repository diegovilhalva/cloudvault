import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseError(error: unknown) {
  if (error instanceof Error) return error.message;

  if (error instanceof Response) return error.statusText;

  if (error instanceof ErrorEvent) return error.message;

  if (error instanceof AxiosError) return error.response?.data?.message || error.message;

  if (typeof error === "string") return error;


  return JSON.stringify(error);
}

export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB", "TB"];
  const k = 1024; // 1 KB = 1024 Bytes
  const i = Math.floor(Math.log(sizeInBytes) / Math.log(k)); // Determine the unit

  const size = (sizeInBytes / Math.pow(k, i)).toFixed(2); // Convert size to the appropriate unit
  return `${size} ${units[i]}`; // Combine size with unit
}

type FileCategory = "document" | "video" | "image" | "audio" | "other";

export function getCategoryFromMimeType(mimeType: string): FileCategory {

  if (mimeType === "application/pdf") return "document";

  if (mimeType.startsWith("video/")) return "video";

  if (mimeType.startsWith("image/")) return "image";

  if (mimeType.startsWith("audio/")) return "audio";

  return "other";
}

export function generatePageKey(page: string): string {
  if (page === "documents") return "document";

  if (page === "images") return "image";

  if (page === "videos") return "video";

  if (page === "others") return "other";

  return page;
}

export const dynamicDownload = async (signedUrl: string, filename: string) => {
  try {
   
    const response = await fetch(`/api/v1/files/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: signedUrl }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to download file: ${response.status} - ${errorText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "downloaded-file"; 
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Erro no download do arquivo:", error);
  }
};





export function ActionResponse<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}