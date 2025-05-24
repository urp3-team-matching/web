/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  BadRequestError,
  InternalServerError,
  MaxApplicantsError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/authUtils";
import type { ApplicantInput } from "@/types/applicant";
import type {
  ApplicantForProject,
  GetProjectsQueryInput,
  ProjectInput,
} from "@/types/project";
import { PaginatedType, PublicType } from "@/types/utils";
import { Applicant, Post, Project } from "@prisma/client";

export type PublicApplicant = PublicType<Applicant>;
export type PublicApplicantForProject = PublicType<ApplicantForProject>;
export type PublicPost = PublicType<Post>;
export type PublicProject = PublicType<Project>;
export type ProjectWithForeignKeys = Project & {
  applicants: PublicApplicantForProject[];
};
export type PublicProjectWithForeignKeys = PublicType<ProjectWithForeignKeys>;

export type PaginatedPosts = PaginatedType<PublicPost>;
export type PaginatedPublicProjects =
  PaginatedType<PublicProjectWithForeignKeys>;

class ApiClient {
  private static instance: ApiClient | null = null;

  private constructor() {}

  /**
   * ApiClient 싱글톤 인스턴스를 초기화합니다.
   * 이미 초기화된 경우 오류를 발생시킵니다.
   * @param config ApiClient 설정 객체 (baseUrl 포함)
   */
  public static initialize(): void {
    if (ApiClient.instance) {
      console.warn("ApiClient has already been initialized.");
      return;
    }
    ApiClient.instance = new ApiClient();
  }

  /**
   * ApiClient 싱글톤 인스턴스를 반환합니다.
   * 초기화되지 않은 경우 오류를 발생시킵니다.
   * @returns ApiClient 인스턴스
   */
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      throw new Error(
        "ApiClient has not been initialized. Call ApiClient.initialize(config) first."
      );
    }
    return ApiClient.instance;
  }

  /**
   * 내부 API 요청 헬퍼 메소드
   */
  private async _request(
    endpoint: string, // 예: "/api/posts", "/api/projects/1" (항상 '/'로 시작 가정)
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: any
  ) {
    const options: RequestInit = {
      method,
      headers: {},
    };

    if (
      body &&
      (method === "POST" || method === "PUT" || method === "DELETE")
    ) {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(body);
    }

    return await fetch(endpoint, options);
  }

  // --- Project API Methods ---
  public async getProjects(
    params?: GetProjectsQueryInput
  ): Promise<PaginatedPublicProjects> {
    const query = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined) as any
        ).toString()
      : "";
    const response = await this._request(`/api/projects?${query}`, "GET");

    if (!response.ok) {
      switch (response.status) {
        case 404:
          throw new NotFoundError();
        case 500:
          throw new InternalServerError("Internal Server Error");
        default:
          throw new Error("Failed to fetch projects");
      }
    }

    return await response.json();
  }

  public async getProjectById(
    id: number
  ): Promise<PublicProjectWithForeignKeys> {
    const response = await this._request(`/api/projects/${id}`, "GET");

    if (!response.ok) {
      switch (response.status) {
        case 404:
          throw new NotFoundError();
        case 500:
          throw new InternalServerError("Internal Server Error");
        default:
          throw new Error("Unknown Error");
      }
    }

    return await response.json();
  }

  public async createProject(data: ProjectInput): Promise<PublicProject> {
    const response = await this._request(`/api/projects`, "POST", data);

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new BadRequestError();
        case 401:
          throw new UnauthorizedError();
        case 500:
          throw new InternalServerError("Internal Server Error");
        default:
          throw new Error("Failed to create project");
      }
    }

    return await response.json();
  }

  public async updateProject(
    id: number,
    data: ProjectInput
  ): Promise<PublicProjectWithForeignKeys> {
    const request = await this._request(`/api/projects/${id}`, "PUT", data);

    if (!request.ok) {
      switch (request.status) {
        case 400:
          throw new BadRequestError(await request.text());
        case 401:
          throw new UnauthorizedError();
        case 404:
          throw new NotFoundError();
        case 500:
          throw new InternalServerError("Internal Server Error");
        default:
          throw new Error("Failed to update project");
      }
    }

    return await request.json();
  }

  public async deleteProject(
    id: number,
    currentPassword: string
  ): Promise<void> {
    const request = await this._request(`/api/projects/${id}`, "DELETE", {
      currentPassword,
    });

    if (!request.ok) {
      switch (request.status) {
        case 400:
          throw new BadRequestError();
        case 401:
          throw new UnauthorizedError();
        case 404:
          throw new NotFoundError();
        case 500:
          throw new InternalServerError("Internal Server Error");
        default:
          throw new Error("Failed to delete project");
      }
    }

    return await request.json();
  }

  // --- Post API Methods ---
  // TODO: Post API 메소드 구현
  // public getPosts(params?: GetPostsQueryInput): Promise<PaginatedPosts> {
  //   const query = params
  //     ? new URLSearchParams(
  //         Object.entries(params).filter(([, v]) => v !== undefined) as any
  //       ).toString()
  //     : "";
  //   return this._request<PaginatedPosts>(`/api/posts?${query}`, "GET");
  // }

  // public getPostById(id: number): Promise<PublicPost> {
  //   return this._request<PublicPost>(`/api/posts/${id}`, "GET");
  // }

  // public createPost(data: CreatePostInput): Promise<PublicPost> {
  //   return this._request<PublicPost>("/api/posts", "POST", data);
  // }

  // public updatePost(id: number, data: UpdatePostInput): Promise<PublicPost> {
  //   return this._request<PublicPost>(`/api/posts/${id}`, "PUT", data);
  // }

  // public deletePost(id: number, currentPassword: string): Promise<void> {
  //   return this._request<void>(`/api/posts/${id}`, "DELETE", {
  //     currentPassword,
  //   });
  // }

  // --- Applicant API Methods ---
  public async getApplicants(projectId: number): Promise<PublicApplicant[]> {
    const response = await this._request(
      `/api/projects/${projectId}/applicants`,
      "GET"
    );

    if (!response.ok) {
      switch (response.status) {
        case 404:
          throw new NotFoundError();
        case 500:
          throw new InternalServerError();
        default:
          throw new Error();
      }
    }

    return await response.json();
  }

  public async getApplicantById(
    projectId: number,
    applicantId: number
  ): Promise<PublicApplicant> {
    const response = await this._request(
      `/api/projects/${projectId}/applicants/${applicantId}`,
      "GET"
    );

    if (!response.ok) {
      switch (response.status) {
        case 404:
          throw new NotFoundError();
        case 500:
          throw new InternalServerError();
        default:
          throw new Error();
      }
    }

    return await response.json();
  }

  public async createApplicant(
    projectId: number,
    data: ApplicantInput
  ): Promise<PublicApplicant> {
    const response = await this._request(
      `/api/projects/${projectId}/applicants`,
      "POST",
      data
    );

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new BadRequestError();
        case 401:
          throw new UnauthorizedError();
        case 409:
          throw new MaxApplicantsError();
        case 500:
          throw new InternalServerError();
        default:
          throw new Error("Failed to create applicant");
      }
    }

    return await response.json();
  }

  public async updateApplicant(
    projectId: number,
    applicantId: number,
    data: ApplicantInput
  ): Promise<PublicApplicant> {
    const response = await this._request(
      `/api/projects/${projectId}/applicants/${applicantId}`,
      "PUT",
      data
    );

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new BadRequestError();
        case 401:
          throw new UnauthorizedError();
        case 404:
          throw new NotFoundError();
        case 500:
          throw new InternalServerError();
        default:
          throw new Error("Failed to update applicant");
      }
    }

    return await response.json();
  }

  public async deleteApplicant(
    projectId: number,
    applicantId: number,
    currentPassword: string
  ): Promise<void> {
    const response = await this._request(
      `/api/projects/${projectId}/applicants/${applicantId}`,
      "DELETE",
      { currentPassword }
    );

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new BadRequestError();
        case 401:
          throw new UnauthorizedError();
        case 404:
          throw new NotFoundError();
        case 500:
          throw new InternalServerError();
        default:
          throw new Error("Failed to delete applicant");
      }
    }

    return await response.json();
  }
}

// 애플리케이션 로드 시 한번만 호출되도록 처리
try {
  ApiClient.initialize();
} catch (error) {
  console.error("Failed to initialize ApiClient:", error);
}

const apiClient = ApiClient.getInstance(); // 싱글톤 인스턴스 가져오기
export default apiClient;
