// ============== GET AI1 INTELLIGENT RESPONSE ==============
        async function getAi1IntelligentResponse(userPrompt) {
            try {
                // 1. Check for creator-specific responses first
                const lowerPrompt = userPrompt.toLowerCase();
                for (const key in CREATOR_RESPONSES) {
                    if (lowerPrompt.includes(key)) {
                        return CREATOR_RESPONSES[key];
                    }
                }

                // 2. Handle Image Generation requests
                if (lowerPrompt.includes('picture') || lowerPrompt.includes('image') || lowerPrompt.includes('generate')) {
                    const imgUrl = getImageUrl(userPrompt);
                    return `### 🎨 Here is your generated image:\n\n<div class="image-gallery"><div class="image-card"><div class="image-container"><img src="${imgUrl}" class="generated-image" alt="AI Generated"></div></div></div>`;
                }

                // 3. Call the Gemini API (Ai1 Engine)
                const response = await fetch(AI1_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: userPrompt }]
                        }]
                    })
                });

                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                
                // Extract the text from Gemini's response structure
                if (data.candidates && data.candidates[0].content.parts[0].text) {
                    return data.candidates[0].content.parts[0].text;
                } else {
                    return "I processed that, but I don't have a verbal response. Try asking something else!";
                }

            } catch (error) {
                console.error("Ai1 Error:", error);
                return "⚠️ **Connection Error:** I'm having trouble reaching Ai1 Labs right now. Please check your internet or API key and try again.";
            }
        }

        // ============== SEND MESSAGE LOGIC ==============
        const userInput = document.getElementById('userInput');
        const sendButton = document.getElementById('sendButton');
        const chatMessages = document.getElementById('chatMessages');

        async function sendMessage() {
            const text = userInput.value.trim();
            if (!text) return;

            // Clear welcome message on first chat
            const welcome = document.querySelector('.welcome-message');
            if (welcome) welcome.remove();

            // Add User Message
            const userMsg = document.createElement('div');
            userMsg.className = 'message';
            userMsg.innerHTML = `<div class="message-avatar"><i class="fas fa-user"></i></div><div class="message-content">${text}</div>`;
            chatMessages.appendChild(userMsg);
            userInput.value = '';

            // Add AI Loading Indicator
            const aiMsg = document.createElement('div');
            aiMsg.className = 'message';
            aiMsg.innerHTML = `<div class="message-avatar"><i class="fas fa-robot"></i></div><div class="message-content"><div class="streaming-indicator"><div class="streaming-dot"></div><div class="streaming-dot"></div><div class="streaming-dot"></div></div></div>`;
            chatMessages.appendChild(aiMsg);
            aiMsg.scrollIntoView({ behavior: 'smooth' });

            // Get and Stream Response
            const response = await getAi1IntelligentResponse(text);
            await streamTextToMessage(response, aiMsg);
        }

        sendButton.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

        // Theme Toggle
        const themeBtn = document.getElementById('themeToggle');
        themeBtn.addEventListener('click', () => {
            const body = document.body;
            const isDark = body.getAttribute('data-theme') === 'dark';
            body.setAttribute('data-theme', isDark ? 'light' : 'dark');
            themeBtn.innerHTML = isDark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        });
    </script>
</body>
</html>
