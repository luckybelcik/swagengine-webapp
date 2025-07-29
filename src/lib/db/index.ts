import type { Element, EngineProjectData, EngineStore } from '$lib/stores/engineStore';
import Dexie, { type Table } from 'dexie';

export interface Project {
  id: string;
  projectData: EngineProjectData;
  elements: Element[];
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
  return db.projects.put(project);
}

export async function getProject(id: string): Promise<Project | undefined> {
  return db.projects.get(id);
}

export async function getAllProjects(): Promise<Project[]> {
  return db.projects.toArray();
}

export async function deleteProject(id: string): Promise<void> {
  await db.projects.delete(id);
}