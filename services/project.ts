import { prisma } from "@/lib/prisma";
import { createPrismaQueryBuilder } from "@/lib/queryBuilder";
import { QueryParams } from "@/lib/queryParser";
import { ListResponse } from "@/services/interface";

export type Project = {
  id: string;
  name: string;
  description: string;
  status: string;
  createdDatetime: string;
  // 기타 필요한 필드들...
};

const projectService = createPrismaQueryBuilder<Project, "project">(
  prisma,
  "project" // Prisma 모델명
);

export async function getProjects(
  query: QueryParams
): Promise<ListResponse<Project>> {
  return projectService.getItems(query);
}

export async function createProject(data: Partial<Project>): Promise<Project> {
  // 필요한 추가 처리 로직
  const newProject = {
    ...data,
    createdDatetime: new Date().toISOString(),
  };

  return projectService.createItem(newProject);
}

export async function getProject(id: string): Promise<Project> {
  return projectService.getItem(id);
}

export async function updateProject(
  id: string,
  data: Partial<Project>
): Promise<Project> {
  return projectService.updateItem(id, data);
}

export async function deleteProject(id: string): Promise<void> {
  return projectService.deleteItem(id);
}
