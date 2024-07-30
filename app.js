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
  let isBold = false;
  let isItalic = false;
  let typingTimeout;

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

const sanitizeHTML = (str) => {
  const tempDiv = document.createElement("div");
  tempDiv.textContent = str;
  return tempDiv.innerHTML;
};

const loadMessages = () => {
  try {
    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    messages.forEach((message) => {
      displayMessage(message);
    });
  } catch (error) {
    console.error("Error loading messages:", error);
  }
};

const saveMessage = (message) => {
  try {
    let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    messages.push(message);
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  } catch (error) {
    console.error("Error saving message:", error);
  }
};

const displayMessage = (message) => {
  const messageElement = document.createElement("div");
  messageElement.innerHTML = `[${message.timestamp}] <b>${sanitizeHTML(
    message.username
  )}:</b> ${sanitizeHTML(message.text)}`;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
};

const updateOnlineUsers = () => {
  try {
    const users = JSON.parse(localStorage.getItem("onlineUsers")) || [];
    onlineUsersUl.innerHTML = "";
    users.forEach((user) => {
      const li = document.createElement("li");
      li.textContent = user;
      onlineUsersUl.appendChild(li);
    });
  } catch (error) {
    console.error("Error updating online users:", error);
  }
};

const notifyTyping = () => {
  typingNotification.textContent = `${username} is typing...`;
  typingNotification.style.display = "block";
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    typingNotification.style.display = "none";
  }, 3000);
};

const simulateTypingNotification = (user) => {
  typingNotification.textContent = `${user} is typing...`;
  typingNotification.style.display = "block";
  setTimeout(() => {
    typingNotification.style.display = "none";
  }, 3000);
};

const changeUsername = () => {
  const newUsername = newUsernameInput.value.trim();
  if (newUsername) {
    try {
      let onlineUsers = JSON.parse(localStorage.getItem("onlineUsers")) || [];
      const index = onlineUsers.indexOf(username);
      if (index > -1) {
        onlineUsers[index] = newUsername;
        localStorage.setItem("onlineUsers", JSON.stringify(onlineUsers));
      }
      username = newUsername;
      localStorage.setItem("currentUser", username);
      updateOnlineUsers();
      newUsernameInput.value = "";
    } catch (error) {
      console.error("Error changing username:", error);
    }
  }
};

const applyFormatting = () => {
  let message = messageInput.value;
  if (isBold) {
    message = `<b>${message}</b>`;
  }
  if (isItalic) {
    message = `<i>${message}</i>`;
  }
  messageInput.value = message;
};

boldBtn.addEventListener("click", () => {
  isBold = !isBold;
  applyFormatting();
});

italicBtn.addEventListener("click", () => {
  isItalic = !isItalic;
  applyFormatting();
});

changeUsernameBtn.addEventListener("click", changeUsername);
