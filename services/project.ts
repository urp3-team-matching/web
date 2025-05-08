import { prisma } from "@/lib/prisma";
import { createPrismaQueryBuilder } from "@/lib/queryBuilder";
import { QueryParams } from "@/lib/queryParser";
import removeSensitiveData, { MaskedType } from "@/services/guard";
import { Project } from "@prisma/client";

// TODO: 레이어별 책임 분리
// 1. 데이터 접근 계층(Repository)
//    - PrismaClient를 사용하여 DB에 직접 접근
//    - 데이터베이스 모델에 대한 CRUD 작업을 수행
// 2. 서비스 계층(Service)
//    - 비즈니스 로직을 처리
//    - API 응답 형식에 맞게 데이터를 가공
// 3. API 계층(Controller)
//    - HTTP 요청을 처리하고 응답을 반환

const projectService = createPrismaQueryBuilder<Project, "project">(
  prisma,
  "project"
);

export async function getProjects(query: QueryParams) {
  const projects = await projectService.getItems(query);
  return removeSensitiveData(projects);
}

export async function createProject(
  data: Partial<Project>
): Promise<MaskedType<Project>> {
  const createdProject = await projectService.createItem(data);
  return removeSensitiveData(createdProject);
}

export async function getProject(id: string): Promise<MaskedType<Project>> {
  return projectService.getItem(id);
}

export async function updateProject(
  id: string,
  data: Partial<Project>
): Promise<MaskedType<Project>> {
  return projectService.updateItem(id, data);
}

export async function deleteProject(id: string): Promise<void> {
  return projectService.deleteItem(id);
}
