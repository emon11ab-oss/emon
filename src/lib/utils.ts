import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOrderId() {
  return "SC-" + Math.random().toString(36).substr(2, 9).toUpperCase();
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString();
}
