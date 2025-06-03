export type WsEvent = 'offer' | 'answer' | 'ice-candidate' | 'connect' | 'end-call';

export interface WsMessage<T = any> {
  event: WsEvent;
  data: T;
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

