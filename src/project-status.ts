export const projectStatuses = [
  "active",
  "ongoing",
  "hiatus",
  "wip",
  "done",
  "dead",
  "archived",
] as const;

export type ProjectStatus = (typeof projectStatuses)[number];

export const projectStatusLabels: Record<ProjectStatus, string> = {
  active: "active",
  ongoing: "ongoing",
  hiatus: "on hiatus",
  wip: "work in progress",
  done: "done",
  dead: "dead",
  archived: "archived",
};
