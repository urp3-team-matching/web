/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  BadRequestError,
  InternalServerError,
  MaxApplicantsError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/authUtils";
import type {
  CreateApplicantInput,
  UpdateApplicantInput,
} from "@/types/applicant";
import type {
  ApplicantForProject,
  CreateProjectInput,
  GetProjectsQueryInput,
  ProposerForProject,
  UpdateProjectInput,
} from "@/types/project";
import type {
  GetProposersQueryInput,
  UpdateProposerInput,
} from "@/types/proposer";
import { PaginatedType, PublicType } from "@/types/utils";
import { Applicant, Post, Project, Proposer } from "@prisma/client";

export type PublicApplicant = PublicType<Applicant>;
export type PublicApplicantForProject = PublicType<ApplicantForProject>;
export type PublicPost = PublicType<Post>;
export type PublicProject = PublicType<Project>;
export type PublicProposer = PublicType<Proposer>;
export type PublicProposerForProject = PublicType<ProposerForProject>;
export type PublicProjectWithProposer = PublicProject & {
  proposer: PublicProposerForProject;
};
export type ProjectWithForeignKeys = Project & {
  proposer: ProposerForProject;
  applicants: ApplicantForProject[];
};
export type PublicProjectWithForeignKeys = PublicType<ProjectWithForeignKeys>;

export type PaginatedPosts = PaginatedType<PublicPost>;
export type PaginatedProposers = PaginatedType<PublicProposer>;
export type PaginatedPublicProjects =
  PaginatedType<PublicProjectWithForeignKeys>;

interface ApiClientConfig {
  baseUrl: string; // 예: "http://localhost:3000", "https://api.yourdomain.com"
}

class ApiClient {
  private static instance: ApiClient | null = null;
  private baseUrl: string;

  // 생성자는 private으로 선언하여 외부에서 직접 인스턴스 생성 방지
  private constructor(config: ApiClientConfig) {
    // baseUrl이 '/'로 끝나면 제거하여 일관성 유지
    this.baseUrl = config.baseUrl.endsWith("/")
      ? config.baseUrl.slice(0, -1)
      : config.baseUrl;
  }

  /**
   * ApiClient 싱글톤 인스턴스를 초기화합니다.
   * 이미 초기화된 경우 오류를 발생시킵니다.
   * @param config ApiClient 설정 객체 (baseUrl 포함)
   */
  public static initialize(config: ApiClientConfig): void {
    if (ApiClient.instance) {
      console.warn("ApiClient has already been initialized.");
      // 또는 throw new Error("ApiClient has already been initialized.");
      return;
    }
    ApiClient.instance = new ApiClient(config);
    console.log(
      `ApiClient initialized with baseUrl: ${ApiClient.instance.baseUrl}`
    );
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

    const url = `${this.baseUrl}${endpoint}`; // baseUrl과 엔드포인트 결합

    if (
      body &&
      (method === "POST" || method === "PUT" || method === "DELETE")
    ) {
      options.headers = { "Content-Type": "application/json" };
      options.body = JSON.stringify(body);
    }

    return await fetch(url, options);
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

  public async createProject(
    data: CreateProjectInput
  ): Promise<PublicProjectWithProposer> {
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
    data: UpdateProjectInput
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
    data: CreateApplicantInput
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
    data: UpdateApplicantInput
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

  // --- Proposer API Methods ---
  public async getProposers(
    params?: GetProposersQueryInput
  ): Promise<PaginatedProposers> {
    const query = params
      ? new URLSearchParams(
          Object.entries(params).filter(([, v]) => v !== undefined) as any
        ).toString()
      : "";

    const response = await this._request(`/api/proposers?${query}`, "GET");

    if (!response.ok) {
      switch (response.status) {
        case 404:
          throw new NotFoundError();
        case 500:
          throw new InternalServerError("Internal Server Error");
        default:
          throw new Error("Failed to fetch proposers");
      }
    }

    return await response.json();
  }

  public async getProposerById(id: number): Promise<PublicProposer> {
    const response = await this._request(`/api/proposers/${id}`, "GET");

    if (!response.ok) {
      switch (response.status) {
        case 404:
          throw new NotFoundError();
        case 500:
          throw new InternalServerError("Internal Server Error");
        default:
          throw new Error("Failed to fetch proposer");
      }
    }

    return await response.json();
  }

  // 독립적 Proposer 수정 (API 라우트 존재 시)
  public async updateProposer(
    id: number,
    data: UpdateProposerInput
  ): Promise<PublicProposer> {
    const response = await this._request(`/api/proposers/${id}`, "PUT", data);

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
          throw new Error("Failed to update proposer");
      }
    }

    return await response.json();
  }

  // 독립적 Proposer 삭제 (API 라우트 존재 시)
  public async deleteProposer(
    id: number,
    currentPassword: string
  ): Promise<void> {
    const response = await this._request(`/api/proposers/${id}`, "DELETE", {
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
          throw new Error("Failed to delete proposer");
      }
    }

    return await response.json();
  }
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"; // "/api"를 사용하지 않고 다른 도메인이라면 설정

// 애플리케이션 로드 시 한번만 호출되도록 처리
try {
  ApiClient.initialize({ baseUrl: API_BASE_URL });
} catch (error) {
  console.error("Failed to initialize ApiClient:", error);
}

const apiClient = ApiClient.getInstance(); // 싱글톤 인스턴스 가져오기
export default apiClient;
