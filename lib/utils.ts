import { PublicProjectWithForeignKeys } from "@/lib/apiClientHelper";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getProjectStatus(project: PublicProjectWithForeignKeys) {
  return project
    ? project.applicants.filter((applicant) => applicant.status === "APPROVED")
        .length >= 4
      ? "closed"
      : "recruiting"
    : "recruiting";
}

export function parseDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getCurrentKoreanDate() {
  const now = new Date();
  const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return koreaTime.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
