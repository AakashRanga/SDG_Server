export interface Member {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  image: string;
}

export interface MeetingMinutes {
  id: string;
  title: string;
  date: string;
  content: string;
  attachments: string[];
}

export interface Committee {
  id: string;
  name: string;
  description: string;
  members: Member[];
  minutes: MeetingMinutes[];
}

// Types for Green Office (if needed elsewhere)
export interface Mission {
  id: string;
  title: string;
  description: string;
}

export interface Commitment {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  date: string;
}