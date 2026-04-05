<script>
        // Use your Gemini API Key here
        const AI1_API_KEY = "AIzaSyAQJJ8_P0oSL73-9DGm43en7gA_NYU0VV4"; 
        // Updated to the latest stable Gemini 1.5 Flash model
        const AI1_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${AI1_API_KEY}`;

        const CREATOR_RESPONSES = {
            'who made you': '### 👤 Created by Noe Benitez!\n\n**Noe Benitez** is my creator and the founder of **Ai1 Labs**! 🎉',
            'who is your creator': '### 👤 Noe Benitez created me!\n\nHe is the founder of Ai1 Labs.',
            'noe benitez': '### 👤 About Noe Benitez\n\nNoe Benitez is the founder and lead developer of Ai1 Labs. 🏆'
        };

        async function getAi1Response(prompt) {
            const lower = prompt.toLowerCase();
            
            // 1. Check Creator Custom Responses
            for (let key in CREATOR_RESPONSES) {
                if (lower.includes(key)) return CREATOR_RESPONSES[key];
            }

            // 2. Check for Image Generation Requests
            if (lower.includes('picture') || lower.includes('image') || lower.includes('draw')) {
                const cleanPrompt = prompt.replace(/make|image|picture|draw|of|a|an/gi, '').trim();
                const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1024&height=1024&nologo=true`;
                return `### 🎨 Ai1 Image Generator\nSuccessfully generated: **${cleanPrompt}**\n\n<img src="${imgUrl}" class="generated-image" style="max-width:100%; border-radius:10px;">`;
            }

            // 3. Gemini API Call with Error Handling
            try {
                const response = await fetch(AI1_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }]
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    // This helps you debug if the API key is wrong or expired
                    return `⚠️ **Ai1 Connection Error:** ${data.error.message}`;
                }

                return data.candidates[0].content.parts[0].text;

            } catch (err) {
                console.error("Connection Error:", err);
                return "⚠️ **Connection Blocked.** \n\nBrowsers often block API calls from local files (`file:///`). \n\n**To fix this:**\n1. Use 'Live Server' in VS Code.\n2. Or upload your code to GitHub Pages.";
            }
        }

        async function sendMessage() {
            const input = document.getElementById('userInput');
            const text = input.value.trim();
            if (!text) return;

            const chatBox = document.getElementById('chatMessages');
            
            // Remove welcome screen on first message
            const welcome = document.querySelector('.welcome-message');
            if (welcome) welcome.remove();

            // Display User Message
            chatBox.innerHTML += `
                <div class="message">
                    <div class="message-avatar"><i class="fas fa-user"></i></div>
                    <div class="message-content">${text}</div>
                </div>`;
            
            input.value = '';
            chatBox.scrollTop = chatBox.scrollHeight;

            // Display Loading Animation
            const loadingId = 'loading-' + Date.now();
            chatBox.innerHTML += `
                <div class="message" id="${loadingId}">
                    <div class="message-avatar" style="background: var(--ai1-gradient)">Ai</div>
                    <div class="message-content">
                        <div class="streaming-indicator">
                            <div class="streaming-dot"></div>
                            <div class="streaming-dot"></div>
                            <div class="streaming-dot"></div>
                        </div>
                    </div>
                </div>`;
            chatBox.scrollTop = chatBox.scrollHeight;

            // Get & Display AI Response
            const reply = await getAi1Response(text);
            const loadingDiv = document.getElementById(loadingId);
            
            // Use 'marked' library to render Markdown from Gemini
            loadingDiv.querySelector('.message-content').innerHTML = marked.parse(reply);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        // Event Listeners
        document.getElementById('sendButton').addEventListener('click', sendMessage);
        document.getElementById('userInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        function setAndSend(val) {
            document.getElementById('userInput').value = val;
            sendMessage();
        }

        // Dark/Light Mode Toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            const body = document.body;
            const icon = document.querySelector('#themeToggle i');
            if (body.getAttribute('data-theme') === 'light') {
                body.setAttribute('data-theme', 'dark');
                icon.className = 'fas fa-sun';
            } else {
                body.setAttribute('data-theme', 'light');
                icon.className = 'fas fa-moon';
            }
        });
    </script>
