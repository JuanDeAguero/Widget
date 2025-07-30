import type { File, Project } from '../index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const getAuthToken = (): string | null => {
  try {
    const saved = localStorage.getItem('widget_auth');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.token;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const createHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
  return headers;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('widget_auth');
      window.location.href = '/login';
      throw new Error('Authentication required');
    }
    const error = await response.json();
    throw new Error(error.detail || 'API request failed');
  }
  return response.json();
};

export const projectAPI = {
  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: createHeaders()
    });
    return handleResponse(response);
  },

  async getDefaultProject(): Promise<Project & { files: File[] }> {
    const response = await fetch(`${API_BASE_URL}/default-project`, {
      headers: createHeaders()
    });
    return handleResponse(response);
  },

  async getProject(projectId: string): Promise<Project & { files: File[] }> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      headers: createHeaders()
    });
    return handleResponse(response);
  },

  async createProject(projectData: { id: string; name: string }): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(projectData)
    });
    return handleResponse(response);
  },

  async updateProject(projectId: string, name: string): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}?project_name=${encodeURIComponent(name)}`, {
      method: 'PUT',
      headers: createHeaders()
    });
    return handleResponse(response);
  },

  async deleteProject(projectId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      method: 'DELETE',
      headers: createHeaders()
    });
    return handleResponse(response);
  },

  async createFile(projectId: string, fileData: {
    id: string;
    name: string;
    type: string;
    path: string;
    content?: any;
    thumbnail?: string;
  }): Promise<File> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/files`, {
      method: 'POST',
      headers: createHeaders(),
      body: JSON.stringify(fileData)
    });
    return handleResponse(response);
  },

  async updateFile(projectId: string, fileId: string, updateData: {
    name?: string;
    content?: any;
    thumbnail?: string;
  }): Promise<File> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/files/${fileId}`, {
      method: 'PUT',
      headers: createHeaders(),
      body: JSON.stringify(updateData)
    });
    return handleResponse(response);
  },

  async deleteFile(projectId: string, fileId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/files/${fileId}`, {
      method: 'DELETE',
      headers: createHeaders()
    });
    return handleResponse(response);
  }
};

export const api = {
  ...projectAPI,
  projects: projectAPI
};