<script setup lang="ts">
import type { RefSymbol } from '@vue/reactivity';
import { onMounted, ref } from 'vue';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'; 

let videoContainerRef = ref<HTMLVideoElement | null>(null); 

//http://26.201.58.143:5154/swagger
//соединение с сокетами
let connection = new HubConnectionBuilder()
  .withUrl('http://26.201.58.143:5154/signaling')
  .configureLogging(LogLevel.Error)
  .build()

async function start() {
    try {
        await connection.start();
        console.error("SignalR Connected.");
    } catch (err) {
        //setTimeout(start, 5000);
        console.error(err)
    }
};


let initStreamAsync = async () => {
  //видео контент
  if (videoContainerRef.value == null) return
  let streamSrc = await navigator.mediaDevices.getUserMedia({video: true, audio: false})
  videoContainerRef.value.srcObject = streamSrc;

  let message = "Пойдем в доту 2"
  
  start()
  //послать
  console.log('привет')
  await connection.invoke("SendMessage", message);
}

onMounted(initStreamAsync)

</script>

<template>
  <div class="video__container">
    <video ref="videoContainerRef" class="video-player" autoplay playsinline></video>
  </div>
</template>