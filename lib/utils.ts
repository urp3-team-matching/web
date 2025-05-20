import { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getProjectStatus(project: PublicProjectWithForeignKeys) {
  return project
    ? project.applicants.length >= 4
      ? "closed"
      : "recruiting"
    : "recruiting";
}
