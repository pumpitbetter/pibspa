import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function consoleLogFormData(formData: FormData) {
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
}
