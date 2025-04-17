import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "N/A";
  
  try {
    // Convert string to Date if needed
    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    // Check if date is valid
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return "Invalid date";
    }
    
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}
