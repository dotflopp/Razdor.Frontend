<script setup lang="ts">
import type { RefSymbol } from '@vue/reactivity';
import { onMounted, ref } from 'vue';
import PeerConnection from '@/app/webrtc';

let localVideoRef = ref<HTMLVideoElement | null>(null); 
let remoteVideoRef = ref<HTMLVideoElement | null>(null); 

let localStreamSrc: MediaStream
let peerConnection: PeerConnection
let remoteStreamSrc: MediaStream

let initStreamAsync = async () => {
  //видео контент
  if (localVideoRef.value == null) return
  localStreamSrc = await navigator.mediaDevices.getUserMedia({video: true, audio: false})
  localVideoRef.value.srcObject = localStreamSrc;



  peerConnection = new PeerConnection()
  await peerConnection.createPeerConection(localStreamSrc, remoteVideoRef.value!)

  await peerConnection.startCall()
}


onMounted(initStreamAsync)

</script>

<template>
  <div class="video__container">
    <video ref="localVideoRef" class="video-player" autoplay playsinline></video>
    <video ref="remoteVideoRef" class="video-player" autoplay playsinline></video>
  </div>
</template>