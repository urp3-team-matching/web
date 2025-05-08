import { createListHandler, createPostHandler } from "@/lib/queryParser";
import { createProject, getProjects } from "@/services/project";

export const GET = createListHandler(getProjects);
export const POST = createPostHandler(createProject);
