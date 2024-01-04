document.addEventListener('DOMContentLoaded', () => {
  const messagesDiv = document.getElementById('messages');
  const messageInput = document.getElementById('messageInput');
  const sendButton = document.getElementById('sendButton');

  // Establish SSE connection
  const eventSource = new EventSource('/sse');

  eventSource.onmessage = (event) => {
    appendBotMessage(event.data);
  };

  sendButton.addEventListener('click', (event) => {
    event.preventDefault();
    const message = messageInput.value.trim();
    
    if (message !== '') {
      sendMessage(message);
      appendUserMessage(message);
      messageInput.value = '';
    }
  });

  function sendMessage(message) {
    fetch(`/chat?message=${encodeURIComponent(message)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  function appendBotMessage(message) {
    const botTypingIndicator = document.createElement('div');
    botTypingIndicator.classList.add('chat');
    botTypingIndicator.classList.add('chat-bot');
    botTypingIndicator.innerHTML = `
      <span class="user-icon"><i class="fa fa-robot"></i></span>
      <p><span class="typing-indicator"></span></p>
    `;
    messagesDiv.appendChild(botTypingIndicator);

    // Simulating typing animation
    const typingIndicator = botTypingIndicator.querySelector('.typing-indicator');
    const typingInterval = setInterval(() => {
      if (typingIndicator.textContent === '...') {
        typingIndicator.textContent = '';
      } else {
        typingIndicator.textContent += '.';
      }
    }, 500);

    // Simulating bot "typing" delay
    setTimeout(() => {
      clearInterval(typingInterval); 
      botTypingIndicator.remove();

      const newMessage = document.createElement('div');
      newMessage.classList.add('chat');
      newMessage.classList.add('chat-bot');
      newMessage.innerHTML = `
        <span class="user-icon"><i class="fa fa-robot"></i></span>
        <p>${message}</p>
      `;
      messagesDiv.appendChild(newMessage);
    }, 2000); 
  }


  function appendUserMessage(message) {
    const newMessage = document.createElement('div');
    newMessage.classList.add('chat');
    newMessage.classList.add('user');
    newMessage.innerHTML = `
      <span class="user-icon"><i class="fa fa-user"></i></span>
      <p>${message}</p>
    `;
    messagesDiv.appendChild(newMessage);
  }
});
