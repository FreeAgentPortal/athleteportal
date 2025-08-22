export type OwnerKind =
  | 'AthleteProfile' // athletes
  | 'User'; // fallback if you ever want a user-level resume

export interface IPolymorphicOwner {
  kind: OwnerKind; // model name
  ref: string; // id of that model
}

export interface IResumeProfile {
  _id: string;
  owner: IPolymorphicOwner;
  experiences: IExperience[];
  education: IEducation[];
  awards: IAward[];
  qa: IQA[]; // general Q&A (“basic questions”)
  references: IReference[];
  media: IMedia[];
  visibility: 'public' | 'private' | 'link';
  version: number; // increment on each major edit
  updatedAt: Date;
  createdAt: Date;
}

export interface IExperience {
  _id: string;
  orgName: string; // team/club/school
  league?: string; // NFL, NCAA DII, JUCO, etc.
  level?: 'Pro' | 'College' | 'HighSchool' | 'Club' | 'Other';
  position?: string;
  location?: { city?: string; state?: string; country?: string };
  startDate?: Date;
  endDate?: Date; // null/undefined = present
  achievements?: string[]; // bullets
  stats?: Record<string, number | string>; // flexible per sport
  media?: IMedia[]; // links to highlight clips, images
}

export interface IEducation {
  _id: string;
  school: string;
  degreeOrProgram?: string;
  startDate?: Date;
  endDate?: Date;
  notes?: string;
}

export interface IAward {
  _id: string;
  title: string; // “All-Conference”, “MVP”
  org?: string; // who issued it
  year?: number;
  description?: string;
}

export interface IQA {
  _id: string;
  promptId: string; // stable ID for a question
  question: string;
  answer: string;
}

export interface IReference {
  _id: string;
  name: string;
  role?: string; // coach, trainer, etc.
  organization?: string;
  contact?: { email?: string; phone?: string };
}

export interface IMedia {
  _id: string;
  kind: 'video' | 'image' | 'link';
  url: string;
  label?: string;
}
