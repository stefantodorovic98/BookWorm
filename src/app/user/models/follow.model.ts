export interface Follow {
  _id: number;
  idUser: number;
  username: string;
  whomFollows: number;
  whomUsername: string;
}
