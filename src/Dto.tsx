export interface Artist {
  id: string;
  artist: string;
  attendees: User[];
  attending: boolean;
  timeStart: string;
  timeEnd: string;
}

export interface Stage {
  stage: string;
  artists: Artist[];
}

export interface Day {
  date: string;
  weekDay: string;
  stages: Stage[];
}

export interface Schedule {
  weekName: string;
  weekNumber: number;
  days: Day[];
}

export interface User {
  name: string;
  id: string;
  following: string[];
}

export interface ScheduleAPIResponse {
  me: User;
  owner: User;
  schedule: Schedule[];
}
