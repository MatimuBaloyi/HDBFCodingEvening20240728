document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("login-section");
  const chatSection = document.getElementById("chat-section");
  const joinBtn = document.getElementById("join-btn");
  const usernameInput = document.getElementById("username");
  const messageInput = document.getElementById("message-input");
  const sendBtn = document.getElementById("send-btn");
  const messagesDiv = document.getElementById("messages");
  const onlineUsersUl = document.getElementById("online-users");
  const typingNotification = document.getElementById("typing-notification");
  const changeUsernameBtn = document.getElementById("change-username-btn");
  const newUsernameInput = document.getElementById("new-username");

  let username = "";

  // Event listener for joining the chat
  joinBtn.addEventListener("click", () => {
    username = usernameInput.value.trim();
    if (username) {
      try {
        localStorage.setItem("currentUser", username);
        let onlineUsers = JSON.parse(localStorage.getItem("onlineUsers")) || [];
        if (!onlineUsers.includes(username)) {
          onlineUsers.push(username);
          localStorage.setItem("onlineUsers", JSON.stringify(onlineUsers));
        }
        loginSection.style.display = "none";
        chatSection.style.display = "flex";
        loadMessages();
        updateOnlineUsers();
      } catch (error) {
        console.error("Error joining chat:", error);
      }
    }
  });

  // Event listener for sending messages
  sendBtn.addEventListener("click", () => {
    const messageText = messageInput.value.trim();
    if (messageText) {
      const message = {
        username: username,
        text: messageText,
        timestamp: new Date().toLocaleTimeString(),
      };
      saveMessage(message);
      displayMessage(message);
      messageInput.value = "";
    }
  });
});
