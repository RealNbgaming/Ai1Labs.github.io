async function getAi1Response(prompt) {
    // ... (Keep your creator and image checks) ...

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
            // This pulls the REAL error message from Google's servers
            console.error("Google Error Details:", data);
            return `⚠️ **Google API Error:** ${data.error.message} (Code: ${data.error.code})`;
        }

        return data.candidates[0].content.parts[0].text;

    } catch (err) {
        // If it falls here, the browser blocked the request before it even hit Google
        return "⚠️ **Browser Security Block.** You cannot run this by double-clicking the file. Please use 'Live Server' or host it on GitHub/Netlify.";
    }
}
