export type StudentResponse = {
  questionId: string;
  questionTypeId: string | null;
  studentAnswer: string;
  questionAnswer: string;
};

type TimeFrame = "month" | "year";
type Period = {
  year: number;
  month: number;
};

type HistoryData = {
  marks: number;
  year: number;
  month: number;
  day?: number;
};
