import type { Element, EngineProjectData } from '$lib/data/_definitions';
import Dexie, { type Table } from 'dexie';

export interface Project {
  id: string;
  projectData: EngineProjectData;
  elements?: Element[];
}

export class SwagDB extends Dexie {
  projects!: Table<Project>;

  constructor() {
    super('swagappDatabase');

    this.version(1).stores({
      projects: 'id, name, projectData.name',
    });
  }
}

export const db = new SwagDB();

export async function saveProject(project: Project): Promise<string> {
  try {
    return db.projects.put(project);
  } catch (error) {
    console.error("Failed to save project:", error);
    return '';
  }
}

export async function getProject(id: string): Promise<Project | undefined> {
  try {
    return db.projects.get(id);
  } catch (error) {
    console.error("Failed to retrieve project:", error);
    return undefined;
  }
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    return db.projects.toArray();
  } catch (error) {
    console.error("Failed to get all projects:", error);
    return [];
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    await db.projects.delete(id);
  } catch (error) {
    console.error("Failed to delete project:", error);
    return;
  }
}

export async function getAllProjectIds(): Promise<string[]> {
  try {
    return db.projects.toCollection().primaryKeys();
  } catch (error) {
    console.error("Failed to retrieve all project ids:", error);
    return [];
  }
}