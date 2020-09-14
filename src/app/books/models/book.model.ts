export interface Book {
  _id: number;
  imagePath: string;
  title: string;
  authors: string;
  issueDate: Date;
  genres: string;
  description: string;
  averageMark: number;
  sumMark: number;
  numMark: number;
  allowed: string;
}
