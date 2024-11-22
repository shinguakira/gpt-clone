import express from "express";
import * as dotenv from "dotenv"
import cors from "cors";
import {Configuration,OpenAIApi} from "openai";


interface RequestBody {
    prompt: string;
}

dotenv.config();
const configuration = new Configuration({
    apiKey :process.env.OPENAI_API_KEY,
});

const openai: OpenAIApi = new OpenAIApi(configuration);
const app = express();
app.use(cors());
app.use(express.json());


app.post("/", async (req: express.Request<{}, {}, RequestBody>, res: express.Response) => {
    try {
        const prompt = req.body.prompt;
        console.log(prompt);
    } catch (error) {
        console.log(error);
    }
});
app.listen(5000,()=>{
    console.log("Server is runing on port 5000");
})