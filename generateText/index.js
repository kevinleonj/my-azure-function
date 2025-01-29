const axios = require("axios");

module.exports = async function (context, req) {
    // 1. Read prompt from the incoming request body
    const userPrompt = (req.body && req.body.prompt) || "Escribe algo interesante sobre Ecuador.";

    // 2. Prepare the OpenAI API request
    const openAiUrl = process.env.OPENAI_ENDPOINT + "/openai/deployments/"
                      + process.env.OPENAI_DEPLOYMENT
                      + "/chat/completions?api-version=2023-03-15-preview";

    try {
        const response = await axios.post(
            openAiUrl,
            {
                messages: [{ role: "user", content: userPrompt }],
                max_tokens: 200,
                temperature: 0.7
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-key": process.env.OPENAI_API_KEY
                }
            }
        );

        // 3. Extract generated text
        const generatedText = response.data.choices[0].message.content;

        // 4. Return JSON response
        context.res = {
            status: 200,
            body: { result: generatedText }
        };

    } catch (error) {
        context.res = {
            status: 500,
            body: { error: error.message }
        };
    }
};
