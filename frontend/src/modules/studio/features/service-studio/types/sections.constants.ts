export type ServiceStudioSectionId = 
  | "basic-info"
  | "categories"
  | "capabilities"
  | "availability";

export interface ServiceStudioSection {
  id: ServiceStudioSectionId;
  title: string;
  description?: string;
  number: number;
}

export const SERVICE_STUDIO_SECTIONS: ServiceStudioSection[] = [
  {
    id: "basic-info",
    title: "Basic Info",
    description: "Essential identification and context for the external service.",
    number: 1,
  },
  {
    id: "categories",
    title: "Categories",
    description: "Classification of service utility and domain expertise.",
    number: 2,
  },
  {
    id: "capabilities",
    title: "Capabilities",
    description: "Definition of specific tasks and features this service provides.",
    number: 3,
  },
  {
    id: "availability",
    title: "Availability",
    description: "Configure which teams and domains can access this integration.",
    number: 4,
  },
];
