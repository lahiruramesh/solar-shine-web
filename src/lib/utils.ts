import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

export const getImageWithCacheBusting = (url: string) => {
  if (!url) return "";
  // Appends a timestamp to the image URL to bypass browser cache
  return `${url}?v=${new Date().getTime()}`;
};

/**
 * Safely prepare data for Appwrite database operations by filtering out
 * undefined values and converting empty strings to null
 */
export function prepareAppwriteData<T extends Record<string, any>>(data: T): Record<string, any> {
  const result: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    // Skip undefined values
    if (value === undefined) continue;
    
    // Convert empty strings to null for Appwrite
    if (value === '') {
      result[key] = null;
    } else {
      result[key] = value;
    }
  }
  
  return result;
}
