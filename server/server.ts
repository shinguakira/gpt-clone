import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

interface RequestBody {
    prompt: string;
}

dotenv.config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai: OpenAIApi = new OpenAIApi(configuration);
const app = express();
app.use(cors());
app.use(express.json());

app.post("/", async (req: express.Request<{}, {}, RequestBody>, res: express.Response) => {
    try {
        const prompt: string = req.body.prompt;
        console.log(prompt);
        const response = await openai.createChatCompletion({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            temperature: 1,
            max_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        });
        console.log(response.data);

        res.status(200).send({
            res: response.data.choices && response.data.choices[0] && response.data.choices[0].message && response.data.choices[0].message.content ? response.data.choices[0].message.content : "No content",
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error details:", (error as any).response ? (error as any).response.data : error.message);
        } else {
            console.error("Unexpected error:", error);
        }
        res.status(500).send({
            error: "An error occurred while processing your request.",
        });
    }
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});