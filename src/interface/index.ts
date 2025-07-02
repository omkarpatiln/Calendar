export type AgendaEntry = {
  name: string;
  startTime: string;
  endTime: string;
  height: number;
  day: string;
};

export type AgendaSchedule = {
  [date: string]: AgendaEntry[];
};
