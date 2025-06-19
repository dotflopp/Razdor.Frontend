export type WsEvent = 'userInChannel' | 'userJoinRoom' | 'userLeaveRoom' | 'offer' | 'answer' | 'ice-candidate';

export interface WsMessage<T = any> {
  event: WsEvent;
  body: T;
}

export interface OfferData {
  offer: RTCSessionDescriptionInit;
  from: string; // ID отправителя (опционально)
}

export interface AnswerData {
  answer: RTCSessionDescriptionInit;
}

export interface IceCandidateData {
  candidate: RTCIceCandidateInit;
}

export interface ConnectionToken {
  token: string
}