import { apiClient } from "../client";
import type {
  ProjectsResult,
  NewProjectResult,
  NewProjectRequest,
  ChatRequest,
  ProjectResult,
  ProjectUpdateResult,
  DeleteProjectResult,
} from "../types";

export const projectService = {
  async projects(): Promise<ProjectsResult> {
    try {
      const resp = await apiClient.get<ProjectsResult>("/projects", true);
      if (resp.success) {
        return resp;
      } else {
        return { success: false, projects: [] };
      }
    } catch (error: any) {
      return { success: false, projects: [] };
    }
  },
  async delete_project(projectID: string): Promise<DeleteProjectResult> {
    try {
      const resp = await apiClient.delete<DeleteProjectResult>(
        `/projects/${projectID}`,
        true,
      );
      if (resp.success) {
        return resp;
      } else {
        return { success: false };
      }
    } catch (error: any) {
      return { success: false };
    }
  },
  async newProject(req: NewProjectRequest): Promise<NewProjectResult> {
    try {
      const resp = await apiClient.post<NewProjectResult>(
        "/projects",
        req,
        true,
      );
      if (resp.success) {
        return resp;
      } else {
        return { success: false, project_id: "" };
      }
    } catch (error: any) {
      return { success: false, project_id: "" };
    }
  },
  async getProject(projectID: string): Promise<ProjectResult> {
    try {
      const resp = await apiClient.get<ProjectResult>(
        `/projects/${projectID}`,
        true,
      );
      if (resp.success) {
        return resp;
      } else {
        return {
          success: false,
          project_id: "",
          title: "",
          instructions: "",
          created_at: "",
          updated_at: "",
          threads: [],
        };
      }
    } catch (error: any) {
      return {
        success: false,
        project_id: "",
        title: "",
        instructions: "",
        created_at: "",
        updated_at: "",
        threads: [],
      };
    }
  },
  async getProjectOmitThreads(projectID: string): Promise<ProjectResult> {
    try {
      const resp = await apiClient.get<ProjectResult>(
        `/projects/${projectID}?include_threads=false`,
        true,
      );
      if (resp.success) {
        return resp;
      } else {
        return {
          success: false,
          project_id: "",
          title: "",
          instructions: "",
          created_at: "",
          updated_at: "",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        project_id: "",
        title: "",
        instructions: "",
        created_at: "",
        updated_at: "",
      };
    }
  },
  async projectUpdate(
    projectID: string,
    title: string,
    inst: string,
  ): Promise<ProjectUpdateResult> {
    try {
      const req = { title: title, instructions: inst };
      const resp = await apiClient.post<ProjectUpdateResult>(
        `/projects/${projectID}`,
        req,
        true,
      );
      if (resp.success) {
        return resp;
      } else {
        return { success: false, project_id: "" };
      }
    } catch (err: any) {
      return { success: false, project_id: "" };
    }
  },
  async *projectsNewChat(
    chat: ChatRequest,
    projectID: string,
  ): AsyncGenerator<any, void, unknown> {
    yield* apiClient.streamIterator(`/projects/${projectID}/chat`, chat);
  },
  async *projectsChat(
    chat: ChatRequest,
    projectID: string,
    threadID: string,
  ): AsyncGenerator<any, void, unknown> {
    yield* apiClient.streamIterator(
      `/projects/${projectID}/chat/${threadID}`,
      chat,
    );
  },
};
