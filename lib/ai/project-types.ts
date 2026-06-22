export type AnalyzeProjectRequestBody = {
  projectName: string;
  treeStructure: string;
  packageJson?: string;
  readme?: string;
};

export type LearningModule = {
  id: string;
  title: string;
  description: string;
  files: { path: string; name: string; type: "file" }[];
  status: "locked" | "current" | "completed";
};

export type ProjectOverview = {
  summary: string;
  techStack: string[];
  architecture: string;
};

export type AnalyzeProjectResponseBody = {
  overview: ProjectOverview;
  learningPath: LearningModule[];
};
