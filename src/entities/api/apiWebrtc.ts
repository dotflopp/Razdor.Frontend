import SignalR from '@/entities/services/signalr';
import { RestApiClient, type ISession } from '@/entities/api/apiClient';


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
  forceVideoCodec: 'VP8'
};

// Класс для создания пиир соединения 
class WebRtcConnection {
  private peerConnection: RTCPeerConnection;
  private signalR: SignalR;
  private apiClient: RestApiClient; 
  private session: ISession | undefined;
  private localStream: MediaStream;

  // Добавляем очередь для кандидатов
  private pendingCandidates: RTCIceCandidate[] = [];

  constructor(localStream: MediaStream, ) {
    this.apiClient = new RestApiClient('http://26.101.132.34:5154/');
    this.peerConnection = new RTCPeerConnection(configuration);
    //получаем все треки(аудио видео дорожки) у локального стрима 
    this.localStream = localStream;
    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, localStream)
    })
    
    this.signalR = new SignalR("http://26.101.132.34:5154/signaling");
  }

  //создаем соединение между Peer, устанавливаеи прослушивающие сокеты
  public createPeerConnection = async (remoteVideo: HTMLVideoElement) => {
    //поменять в будущем 
    this.session = await this.apiClient.joinToVoiceChannel({
        id: 1,
        name: 'floppa',
        guildId: 1,
        type: 2
    })
    
    //регистрация сокетов
    this.registerSocketHandlers(this.session.sessionId);

    //старт signalR 
    await this.signalR.startingConnection();
    
    //регестрируем обработчики

    // под вопросом, стоит вынести в отдельный метод
    this.peerConnection.ontrack = event =>  {
      console.log("Видео поток пришел")
      remoteVideo.srcObject = event.streams[0]
    }

    //получение ice кандидата
    this.peerConnection.onicecandidate = this.handleICECandidateEvent
    this.peerConnection.onconnectionstatechange = this.handleSignalingSateEvent
    this.peerConnection.onicegatheringstatechange = this.handleIceConnectionStateChangeEvent;
  }
  private handleIceConnectionStateChangeEvent = (event: Event) => {
    console.log(event);
  };

  private handleSignalingSateEvent = (event: Event) => {
    //console.log(event);
  }

  private handleICECandidateEvent = (event: RTCPeerConnectionIceEvent) => {
    if(event.candidate) {
      console.log('кандидат полетел без ошибок ')
      this.signalR?.connection.invoke("Icecandidate", this.session?.sessionId, event.candidate)
      //console.log('send icecandidate')
    }
  }
  

  private registerSocketHandlers = (sessionId: string) => {
    this.signalR?.connection.on("Offer", async (offerData) => {
      console.log('emit offer from another peer')
      const sessionDesc = new RTCSessionDescription(offerData.offer);
      console.log(sessionDesc.sdp);
      await this.peerConnection.setRemoteDescription(offerData.offer);
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      this.signalR?.connection.invoke("Answer", this.session?.sessionId, offerData.from, this.peerConnection.localDescription);
      console.log('send answer')
    });
    
    this.signalR?.connection.on("Answer", async (answer) => {
      console.log('emit answer from another peer')
      // set remote description
      await this.peerConnection.setRemoteDescription(answer);

      // Применяем отложенные кандидаты
      for (const candidate of this.pendingCandidates) {
        await this.peerConnection.addIceCandidate(candidate);
      }
      this.pendingCandidates = [];

      this.signalR?.connection.send("end-call", this.session?.sessionId);
      
    });
  
    this.signalR?.connection.on("Icecandidate", async (candidate) => {
      if (candidate) {
        if (!this.peerConnection.remoteDescription) {
          // Если remoteDescription ещё не установлен — сохраняем в очередь
          this.pendingCandidates.push(new RTCIceCandidate(candidate));
        } else {
          // Иначе применяем сразу
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      

      // console.log('emit icecandidate from server')
      // //добавляем себе айс кандидата
      // if(candidate) {
      //   await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
      // }
      }
    })
    this.signalR?.connection.on("CallEnded", async () => {
      this.endCall()
    })
  }

  public startCall = async () => {
    //заходим в руму 
    this.signalR?.connection.send("Connect", this.session?.sessionId, {nickname : "Floppa", avatarUrl: null});

    //Создаем sdp пакет и отправляем его
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    await this.signalR?.connection.invoke("Offer", this.session?.sessionId, this.peerConnection.localDescription);
    console.log('send Offer from startCall')
    
  }

  public endCall = async () => {
    if(this.peerConnection) {
      this.peerConnection.close()
    }
  }
}

export default WebRtcConnection