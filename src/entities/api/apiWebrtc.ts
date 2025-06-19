import { SignalingClient } from '../services/webSocket';
import type { IceCandidateData } from '../models/WebRTCModels';


// Настройки STUN-сервера
const configuration = {
  sdpSemantics: 'unified-plan',
  iceServers: [
    { urls: 'turn:fr-turn2.xirsys.com:3478?transport=udp',
      username: "b_x8c3H9otu8vC-LwmnAsPdEQnWlh_zHf54JGX8KJx2wBztiX1udhli1_MK6sxHMAAAAAGcuKjdMdWt1cw==",
      credential: "c8628fa0-9de3-11ef-a83d-0242ac120004"
     },
  ],
  encodedInsertabelStream: true,
};

// Класс для создания пиир соединения 
export class WebRtcClient {
  private peerConnections: Map<string, RTCPeerConnection> = new Map();
  private signalingClient: SignalingClient;
  private localStream: MediaStream;
  private createVideoElement: (userId: string) => HTMLVideoElement;

  // Добавляем очередь для кандидатов
  private pendingCandidates: RTCIceCandidate[] = [];

  constructor(localStream: MediaStream, signalingClient: SignalingClient, createVideoElement: (userId: string) => HTMLVideoElement) {
    this.signalingClient = signalingClient
    this.localStream = localStream;
    this.registerSocketHandlers();
    this.createVideoElement = createVideoElement;
  }

  public addRemoteParticipant(userId: string, remoteVideo: HTMLVideoElement): void {
    const pc = new RTCPeerConnection(configuration);
    this.peerConnections.set(userId, pc);
    
    this.localStream.getTracks().forEach(track => {
      pc.addTrack(track, this.localStream)
    })
    
    this.setupPeerConnection(pc, userId, remoteVideo);

    this.createOfferAndSend(userId);
  }

  private setupPeerConnection(pc: RTCPeerConnection, userId: string, remoteVideo: HTMLVideoElement): void {
    pc.ontrack = event => {
      if (event.streams[0]) {
        remoteVideo.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = event => {
      if (event.candidate) {
        console.log('send icecandidate')
        this.signalingClient.send("ice-candidate", {to: userId, data: event.candidate });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        console.log(`Соединение с ${userId} установлено`);
      }
    };
  }

  private createOfferAndSend(userId: string): void {
    const pc = this.peerConnections.get(userId);
    if (!pc) return;

    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .then(() => {
        this.signalingClient.send("offer", {to: userId, data: pc.localDescription });
        console.log("offer send")
      })
      .catch(err => console.error("Ошибка при создании offer:", err));
  }

  private registerSocketHandlers(): void {
    this.signalingClient.on("offer", async ({ from, data }) => {
      console.log('offer emit')
      const userId = from
      console.log(userId)
      let pc = this.peerConnections.get(userId);
      if (!pc) {
        pc = new RTCPeerConnection(configuration);
        this.peerConnections.set(userId, pc);
        var remoteVideo = this.createVideoElement(from) 
        this.setupPeerConnection(pc, userId, remoteVideo);
      }
      await pc.setRemoteDescription(new RTCSessionDescription(data));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      this.signalingClient.send("answer", { to: userId, data: answer });
      console.log("answer send")
    });

    this.signalingClient.on("answer", async ({ from, data }) => {
      const userId = from
      const pc = this.peerConnections.get(userId);
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(data));

        //применяем отложенные айс кандидаты
        for (const candidate of this.pendingCandidates) {
          await pc.addIceCandidate(candidate);
        }
        this.pendingCandidates = [];
      }
    });

    this.signalingClient.on("ice-candidate", async ({ from, data }) => {
      console.log('ice emit')
      const userId = from
      const pc = this.peerConnections.get(userId);
      if (pc && pc.remoteDescription) {
        try {
          await pc.addIceCandidate(data);
        } catch (e) {
          console.warn("Не удалось добавить ICE кандидата:", e);
        }
      } else {
        this.pendingCandidates.push(data);
      }
    });
  }
}
