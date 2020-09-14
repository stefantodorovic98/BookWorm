export interface UserBook {
  _id: number;
  idUser: number;
  idBook: number;
  title: string;
  authors: string;
  genres: string;
  read: string;
  wait: string;
  currRead: string;
  currPage: number;
  maxPage: number;
  statusMessage: string;
}
