<template>
  <!-- контейнер с видео -->

  <div class="videos">
    <!-- Локальное видео -->
    <video ref="localVideoRef" class="video-player smallFrame" autoplay playsinline></video>
    
    <!-- Здесь будут появляться видео других пользователей -->
    <div id="remote-videos-container"></div>
  </div>


  <!-- контроллеры -->
  <div id="controls">
    <div ref="cameraRef" class="control-container" id="camera-btn" v-bind:style="cameraBtnStyle">
      <img src="/assets/camera.png" /> 
    </div>

    <div ref="micRef" class="control-container" id="mic-btn" v-bind:style="micBtnStyle">
      <img src="/assets/mic.png" />
    </div>

    <a href="lobby.html">
      <router-link to="/main">
        <div class="control-container" id="leave-btn">
          <img src="/assets/phone.png" />
        </div>
      </router-link>
    </a>
  </div>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { WebRtcClient } from '@/entities/api/apiWebrtc';
import { SignalingClient } from '@/entities/services/webSocket';
import { RestApiClient } from '@/entities/api/apiClient';
import { communityStore } from '@/entities/store/community';

const api = new RestApiClient('https://dotflopp.ru/api')
const commStore = communityStore()

const localVideoRef = ref<HTMLVideoElement | null>(null); 
const remoteVideoRef = ref<HTMLVideoElement | null>(null); 
const cameraRef = ref<HTMLElement|null>(null)
const micRef = ref<HTMLElement|null>(null)

let webRTCClient: WebRtcClient
let localStreamSrc: MediaStream

let cameraBtnStyle = ref<any | null>(null)
let micBtnStyle = ref<any | null>(null)

let signalingClient: SignalingClient = null!;

onMounted(async() => {
 
  const request = await api.connectionToVoiceChannel(commStore.getActiveChannel!)
  console.log(request.token)

  signalingClient = new SignalingClient("wss://dotflopp.ru/signaling", request.token);

  await initStreamAsync()

  await signalingClient.start()
})

async function initStreamAsync() {
  //видео контент
  if (localVideoRef.value == null) return
  localStreamSrc = await navigator.mediaDevices.getUserMedia({video: true, audio: true})
  localVideoRef.value.srcObject = localStreamSrc;
  
  webRTCClient = new WebRtcClient(localStreamSrc, signalingClient, createNewVideoElement)

  //НУЖНО добавить столько подключений, сколько пользователей будет
  //получаем пользователей 
  signalingClient.on("userInChannel", async ({ data }) => {
    console.log(data)
    if(!data) return
    data.forEach((item: string) => {
      console.log(item)
      webRTCClient.addRemoteParticipant(item, createNewVideoElement(item))
    });

  })
  
  //регистрация ивентов
  cameraRef?.value?.addEventListener('click', toggleCamera)
  micRef?.value?.addEventListener('click', toggleMic)
}

function createNewVideoElement(userId: string): HTMLVideoElement {
  const video = document.createElement('video');
  video.autoplay = true;
  video.playsInline = true;
  video.className = 'video-player remote-video';
  video.id = `video-${userId}`;

  // Вставить в DOM
  const container = document.getElementById('remote-videos-container');
  if (container) {
    container.appendChild(video);
  }
  return video;
}

//заплатка с рег
async function toggleCamera () {
  let videoTrack = localStreamSrc.getTracks().find(track => track.kind === 'video')

    if(videoTrack!.enabled){
        videoTrack!.enabled = false
        cameraBtnStyle.value = { backgroundColor: 'rgb(255, 80, 80)' }
    }else{
        videoTrack!.enabled = true
        cameraBtnStyle.value = { backgroundColor: 'rgb(179, 102, 249, .9)' }
    }
}

async function toggleMic () {
  let audioTrack = localStreamSrc.getTracks().find(track => track.kind === 'audio')

    if(audioTrack!.enabled){
        audioTrack!.enabled = false
        micBtnStyle.value = { backgroundColor: 'rgb(255, 80, 80)'}
    }else{
        audioTrack!.enabled = true
        micBtnStyle.value = { backgroundColor: 'rgb(179, 102, 249, .9)' }
    }
}

</script>

<style scoped>

.videos {

  position: relative;
  height: calc(100vh - 100px); /* Оставляем место для контроллеров */
  width: 100%;
}

#remote-videos-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
  padding: 15px;
  height: 100%;
  align-items: center;
  justify-items: center;
  overflow-y: auto; /* Если много видео */
}

.video-player {
  background-color: black;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  border: 2px solid #b366f9;
}
.video-player:first-child {
  object-fit: cover;
}


.smallFrame{
  position: fixed;
  top: 20px;
  left: 20px;
  height: 170px;
  width: 300px;
  border-radius: 5px;
  border:2px solid #b366f9;
  -webkit-box-shadow: 3px 3px 15px -1px rgba(0,0,0,0.77);
  box-shadow: 3px 3px 15px -1px rgba(0,0,0,0.77);
  z-index: 999;
}

#controls{
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform:translateX(-50%);
  display: flex;
  gap: 1em;
}


.control-container{
  background-color: rgb(179, 102, 249, .9);
  padding: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.control-container img{
  height: 30px;
  width: 30px;
}

#leave-btn{
  background-color: rgb(255,80,80, 1);
}

@media screen and (max-width:600px) {
  .smallFrame {
      height: 80px;
      width: 120px;
  }
  .control-container img {
      height: 20px;
      width: 20px;
  }
}
</style>