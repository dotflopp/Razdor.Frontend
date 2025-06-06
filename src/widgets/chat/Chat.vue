<template>
  <!-- Чат -->
    <section class="chat-area">
      <div class="message">
        <div class="avatar">U</div>
        <div class="message-content">
          <div class="message-header">
            <span class="username">User1</span>
            <span class="timestamp">10:30 AM</span>
          </div>
          <div class="message-body">
            Hello, this is a sample message!
          </div>
        </div>
      </div>
      <div class="message">
        <div class="avatar">V</div>
        <div class="message-content">
          <div class="message-header">
            <span class="username">User2</span>
            <span class="timestamp">10:31 AM</span>
          </div>
          <div class="message-body">
            How are you doing?
          </div>
        </div>
      </div>
    </section>
    <!-- Поле ввода сообщения -->
    <footer class="message-input">
      <input type="text" placeholder="Type a message..." />
      <button class="send-button">Send</button>
    </footer>
</template> 

<style scoped>
.chat-area {
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #36393f;
}

.message {
  display: flex;
  margin-bottom: 20px;
}

.avatar {
  width: 40px;
  height: 40px;
  background-color: #5865f2;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 10px;
}

.message-content {
  max-width: 80%;
}

.message-header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.username {
  font-weight: bold;
  margin-right: 10px;
}

.timestamp {
  font-size: 12px;
  color: #b9bbbe;
}

.message-body {
  background-color: #40444b;
  padding: 10px;
  border-radius: 5px;
}

/* Поле ввода сообщения */
.message-input {
  height: 60px;
  background-color: #2f3136;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.message-input input {
  flex-grow: 1;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #40444b;
  color: white;
}

.send-button {
  margin-left: 10px;
  padding: 10px 20px;
  background-color: #5865f2;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.send-button:hover {
  background-color: #4752c4;
}
</style> 

