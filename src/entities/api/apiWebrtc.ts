import { SignalingClient } from '../services/webSocket';
import type { IceCandidateData } from '../models/WebRTCModels';


// Настройки STUN-сервера
const configuration = {
  sdpSemantics: 'unified-plan',
  iceServers: [
    { urls: 'turn:fr-turn2.xirsys.com:3478?transport=udp',
      username: "b_x8c3H9otu8vC-LwmnAsPdEQnWlh_zHf54JGX8KJx2wBztiX1udhli1_MK6sxHMAAAAAGcuKjdMdWt1cw==",
      credential: "c8628fa0-9de3-11ef-a83d-0242ac120004"
     }, // STUN-сервер
  ],
  encodedInsertabelStream: true,
};

// Класс для создания пиир соединения 
class WebRtcConnection {
  private peerConnection: RTCPeerConnection;
  private signalingClient: SignalingClient;
  private localStream: MediaStream;

  // Добавляем очередь для кандидатов
  private pendingCandidates: RTCIceCandidate[] = [];

  constructor(localStream: MediaStream, ) {
    this.signalingClient = new SignalingClient("ws://localhost:3000");
    this.peerConnection = new RTCPeerConnection(configuration);
    

    //получаем все треки(аудио видео дорожки) у локального стрима 

    this.localStream = localStream;
    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, localStream)
    })
    this.registerSocketHandlers();
  }

  //создаем соединение между Peer, устанавливаеи прослушивающие сокеты
  public createPeerConnection = async (remoteVideo: HTMLVideoElement) => {
    await this.signalingClient.start()
    // под вопросом, стоит вынести в отдельный метод
    this.peerConnection.ontrack = event =>  {
      const remoteStream = event.streams[0]
      remoteVideo.srcObject = remoteStream;
    }

    //получение ice кандидата
    this.peerConnection.onicecandidate = this.handleICECandidateEvent
    this.peerConnection.onconnectionstatechange = this.handleSignalingSateEvent
    this.peerConnection.onicegatheringstatechange = this.handleIceConnectionStateChangeEvent;
  }

  private handleIceConnectionStateChangeEvent = (event: Event) => {
    //console.log(event);
  };

  private handleSignalingSateEvent = (event: Event) => {
    if (this.peerConnection.iceConnectionState === 'connected') {
      const stats = this.peerConnection.getStats()
      //console.log(stats)
    }
  }

  private handleICECandidateEvent = (event: RTCPeerConnectionIceEvent) => {
    if(event.candidate) {
      this.signalingClient.send<any>('ice-candidate', event.candidate)
      //console.log('send icecandidate')
    }
  }

  private registerSocketHandlers = () => {
    this.signalingClient.on("offer", async (offerData) => {
      
      console.log('emit offer from another peer')
      console.log(offerData)

      const remoteDesc = new RTCSessionDescription(offerData.offer);
      await this.peerConnection.setRemoteDescription(remoteDesc);
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      this.signalingClient.send("answer", answer);

      console.log('send answer')
    });
    
    this.signalingClient.on("answer", async (answer) => {
      console.log('emit answer from another peer')
      
      await this.peerConnection.setRemoteDescription(answer);
      console.log('Обмен закончен')
      // Применяем отложенные кандидаты
      for (const candidate of this.pendingCandidates) {
        console.log(candidate)
        await this.peerConnection.addIceCandidate(candidate);
      }
      this.pendingCandidates = [];
    });
  
    this.signalingClient.on("ice-candidate", async (candidate) => {
      if (candidate) {
        if (!this.peerConnection.remoteDescription) {
          // Если remoteDescription ещё не установлен — сохраняем в очередь
          this.pendingCandidates.push(candidate);
          console.log("сохраняем в очередь")
        } else {
          // Иначе применяем сразу
          console.log(candidate)
          await this.peerConnection.addIceCandidate(candidate);
        }
      }
    })

    this.signalingClient.on("end-call", async () => {
      this.endCall()
    })

  }

  public startCall = async () => {
    //заходим в руму 
    //this.signalingClient.send("connect", {} );

    //Создаем sdp пакет и отправляем его
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    await this.signalingClient.send("offer", {offer});
    console.log('send Offer from startCall')
  }

  public endCall = async () => {
    if(this.peerConnection) {
      this.peerConnection.close()
    }
  }

}

export default WebRtcConnection