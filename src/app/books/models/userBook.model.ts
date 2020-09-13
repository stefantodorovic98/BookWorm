export interface UserBook {
  _id: number;
  idUser: number;
  idBook: number;
  read: string;
  wait: string;
  currRead: string;
  currPage: number;
  maxPage: number;
  statusMessage: string;
}
