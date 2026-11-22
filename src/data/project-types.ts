export type Sector =
  | "highway"
  | "bridge"
  | "airport"
  | "rail"
  | "water"
  | "industrial"
  | "coal"
  | "power";

export type ProjectStatus = "ongoing" | "operating" | "completed" | null;

export type StateName =
  | "Gujarat"
  | "Madhya Pradesh"
  | "Maharashtra"
  | "Rajasthan"
  | "Bihar"
  | "Uttar Pradesh"
  | "Haryana"
  | "Uttarakhand"
  | "Karnataka"
  | "Andhra Pradesh"
  | "Delhi"
  | "Chhattisgarh"
  | "Punjab"
  | "West Bengal"
  | "Tamil Nadu"
  | "Assam";

export interface Project {
  id: string;
  /** Verbatim project name from the source site. */
  name: string;
  employer: string;
  /** Location text as written on the source site (may name two states). */
  locationLabel: string;
  states: StateName[];
  sector: Sector;
  delivery: "EPC" | "BOT/HAM" | null;
  /** null = the source page does not state a status. */
  status: ProjectStatus;
  source: string;
}
