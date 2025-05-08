import {
  createDeleteHandler,
  createGetByIdHandler,
  createPatchHandler,
  createPutHandler,
} from "@/lib/queryParser";
import { deleteProject, getProject, updateProject } from "@/services/project";

export const GET = createGetByIdHandler(getProject);
export const PUT = createPutHandler(updateProject);
export const PATCH = createPatchHandler(updateProject);
export const DELETE = createDeleteHandler(deleteProject);
