export interface InviteEvent {
  _id: number;
  idEvent: number;
  idHost: number;
  idGuest: number;
  text: string;
  hostInvitation: string;
  userRequest: string;
  status: string;
}
