import {
  BadRequestError,
  InternalServerError,
  MaxApplicantsError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/authUtils";
import type { ApplicantInput } from "@/types/applicant";
import { PostInput } from "@/types/post";
import type {
  ApplicantForProject,
  GetProjectsQueryInput,
  ProjectInput,
  ProjectUpdateInput,
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
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any
  ) {
    let url = endpoint;
    // 서버 환경에서는 절대경로 필요
    if (typeof window === "undefined" && endpoint.startsWith("/")) {
      const base =
        process.env.NEXT_PUBLIC_BASE_URL ||
        (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
        "http://localhost:3000";
      url = base + endpoint;
    }

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

    return await fetch(url, options);
  }

  // --- Post API Methods ---
  public async createPost(data: PostInput): Promise<PublicPost> {
    const response = await this._request(`/api/posts`, "POST", data);

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new BadRequestError();
        case 401:
          throw new UnauthorizedError();
        case 500:
          throw new InternalServerError("Internal Server Error");
        default:
          throw new Error("Failed to create post");
      }
    }

    return await response.json();
  }

  public async getPostById(id: number): Promise<PublicPost> {
    const response = await this._request(`/api/posts/${id}`, "GET");

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

  public async getPosts(): Promise<PaginatedPosts> {
    const response = await this._request(`/api/posts`, "GET");

    if (!response.ok) {
      switch (response.status) {
        case 500:
          throw new InternalServerError("Internal Server Error");
        default:
          throw new Error("Failed to fetch posts");
      }
    }

    return await response.json();
  }

  public async updatePost(id: number, data: PostInput): Promise<PublicPost> {
    const response = await this._request(`/api/posts/${id}`, "PUT", data);

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new BadRequestError(await response.text());
        case 401:
          throw new UnauthorizedError();
        case 404:
          throw new NotFoundError();
        case 500:
          throw new InternalServerError("Internal Server Error");
        default:
          throw new Error("Failed to update post");
      }
    }

    return await response.json();
  }

  public async deletePost(id: number): Promise<void> {
    const response = await this._request(`/api/posts/${id}`, "DELETE");

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new BadRequestError();
        case 401:
          throw new UnauthorizedError();
        case 404:
          throw new NotFoundError();
        case 500:
          throw new InternalServerError("Internal Server Error");
        default:
          throw new Error("Failed to delete post");
      }
    }

    if (response.status === 204) {
      return; // No content, deletion successful
    }
    return await response.json();
  }

  // --- Project API Methods ---
  public async getProjects(
    params?: GetProjectsQueryInput
  ): Promise<PaginatedPublicProjects> {
    const query = params
      ? new URLSearchParams(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    data: ProjectUpdateInput
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
    if (request.status === 204) {
      return; // No content, deletion successful
    }
    return await request.json();
  }

  public async verifyProjectPassword(
    id: number,
    password: string
  ): Promise<boolean> {
    const request = await this._request(`/api/projects/${id}/verify`, "POST", {
      password,
    });

    if (!request.ok) {
      switch (request.status) {
        case 400:
          throw new BadRequestError();
        case 401:
          return false;
        case 404:
          throw new NotFoundError();
        case 500:
          throw new InternalServerError("Internal Server Error");
        default:
          throw new Error("Failed to verify project password");
      }
    }

    return true;
  }

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

  public async applyToProject(
    projectId: number,
    data: ApplicantInput
  ): Promise<PublicApplicant> {
    const response = await this._request(
      `/api/projects/${projectId}/apply`,
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

  public async acceptApplicant(
    projectId: number,
    applicantId: number,
    projectProposerPassword: string
  ): Promise<PublicApplicant> {
    const response = await this._request(
      `/api/projects/${projectId}/applicants/${applicantId}/accept`,
      "POST",
      { projectProposerPassword }
    );

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new BadRequestError();
        case 404:
          throw new NotFoundError();
        case 409:
          throw new MaxApplicantsError();
        case 500:
          throw new InternalServerError();
        default:
          throw new Error("Failed to accept applicant");
      }
    }

    return await response.json();
  }

  public async rejectApplicant(
    projectId: number,
    applicantId: number,
    projectProposerPassword: string
  ): Promise<PublicApplicant> {
    const response = await this._request(
      `/api/projects/${projectId}/applicants/${applicantId}/reject`,
      "POST",
      { projectProposerPassword }
    );

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new BadRequestError();
        case 404:
          throw new NotFoundError();
        case 500:
          throw new InternalServerError();
        default:
          throw new Error("Failed to reject applicant");
      }
    }

    return await response.json();
  }

  public async pendingApplicant(
    projectId: number,
    applicantId: number,
    projectProposerPassword: string
  ): Promise<PublicApplicant> {
    const response = await this._request(
      `/api/projects/${projectId}/applicants/${applicantId}/pending`,
      "POST",
      { projectProposerPassword }
    );

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new BadRequestError();
        case 404:
          throw new NotFoundError();
        case 500:
          throw new InternalServerError();
        default:
          throw new Error("Failed to change applicant status to pending");
      }
    }

    return await response.json();
  }

  public async closeProject(
    id: number,
    currentPassword: string
  ): Promise<PublicProjectWithForeignKeys> {
    const response = await this._request(`/api/projects/${id}/close`, "POST", {
      currentPassword,
    });

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new BadRequestError();
        case 401:
          throw new UnauthorizedError();
        case 404:
          throw new NotFoundError();
        case 500:
          throw new InternalServerError("Internal Server Error");
        default:
          throw new Error("Failed to close project");
      }
    }

    return await response.json();
  }

  public async reopenProject(
    id: number,
    currentPassword: string
  ): Promise<PublicProjectWithForeignKeys> {
    const response = await this._request(`/api/projects/${id}/reopen`, "POST", {
      currentPassword,
    });

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new BadRequestError();
        case 401:
          throw new UnauthorizedError();
        case 404:
          throw new NotFoundError();
        case 500:
          throw new InternalServerError("Internal Server Error");
        default:
          throw new Error("Failed to reopen project");
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
