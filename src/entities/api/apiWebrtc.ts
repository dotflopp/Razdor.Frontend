import SignalR from '@/entities/services/signalr';
import { RestApiClient, type ISession } from '@/entities/api/apiClient';
import type { InstanceofExpression } from 'typescript';

// Настройки STUN-сервера
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }, // STUN-сервер
  ],
};

//синглтон для хранения текущего пира 
class PeerConnection {
  private peerConnection: RTCPeerConnection;
  private signalR: SignalR | undefined;
  private apiClient: RestApiClient; 
  private session: ISession | undefined

  constructor() {
    this.apiClient = new RestApiClient('http://26.101.132.34:5154/');
    this.peerConnection = new RTCPeerConnection(configuration);
  }

  //создаем соединение между Peer, устанавливаеи прослушивающие сокеты
  public createPeerConection = async (localStream: MediaStream, remoteVideo: HTMLVideoElement) => {
    this.session = await this.apiClient.joinToVoiceChannel({
        id: 1,
        name: 'floppa',
        guildId: 1,
        type: 2
    })
    
    //устанавливаем прослушивающие сокеты signalR 
    this.signalR = new SignalR("http://26.101.132.34:5154/signaling");
    this.registerSocketHandlers(this.session.sessionId);

    //отправляем сигнал signalR на старт соединения между сокетами 
    await this.signalR.startingConnection();
    
    //получаем все треки(аудио видео дорожки) у локального стрима 
    localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, localStream)
    })

    // под вопросом, стоит вынести в отдельный метод
    this.peerConnection.ontrack = event => {
      remoteVideo.srcObject = event.streams[0]
    }

    //устанавливаем ивент на получение айс кондидата
    this.peerConnection.onicecandidate = event => {
      //console.log('emit icecandidate from local')
      if(event.candidate) {
        this.signalR?.connection.invoke("Icecandidate", this.session?.sessionId, event.candidate)
        //console.log('send icecandidate')
      }
    }
  }
  
  private registerSocketHandlers = (sessionId: string) => {
    this.signalR?.connection.on("Offer", async (offerData) => {
      console.log('emit offer from another peer')
      // set remote description
      console.log(offerData.offer)
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
      this.signalR?.connection.send("end-call", this.session?.sessionId);
      
    });
  
    this.signalR?.connection.on("Icecandidate", async (candidate) => {
      console.log('emit icecandidate from server')
      //добавляем себе айс кандидата
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
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

export default PeerConnection