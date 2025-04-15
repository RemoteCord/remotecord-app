import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function fromBytesToMB(totalMemoryBytes: number) {
	return Math.round(totalMemoryBytes / (1024 * 1024));
}
