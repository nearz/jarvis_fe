import { apiClient } from "../client";
import type {
  ProjectsResult,
  NewProjectResult,
  NewProjectRequest,
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
};
