export type SpaceStatus = "active" | "archived" | "draft";

export type Space = {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly lastEdited: string;
  readonly status: SpaceStatus;
  readonly created_at: string;
  readonly projectId?: string;
  readonly projectName?: string;
};
