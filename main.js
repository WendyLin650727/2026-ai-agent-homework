import { input } from "@inquirer/prompts";
import OpenAI from "openai";
import { OPENAI_API_KEY } from "./config.js";
import { initMessage, addMessage, getMessages } from "./db/messages.js";
//作業 1：打造專屬⾓⾊聊天機器⼈
const client = new OpenAI({ apiKey: OPENAI_API_KEY });

await initMessage(
  "你是一位專門聊星座話題，給星座小建議的大師，像是每週星座運勢、愛情、事業、財富等建議說明。請用繁體中文回答。請用幽默有趣的方式回應。"
);

try {
  while (true) {
    const userQuestion = (
      await input({ message: "請輸入你的星座及問題：" })
    ).trim();

    if (userQuestion === "") continue;
    if (userQuestion.toLowerCase() === "exit") {
      console.log("再會~");
      break;
    }

    await addMessage(userQuestion);

    const response = await client.chat.completions.create({
      model: "gpt-5-mini",
      messages: getMessages(),
    });

    const content = response.choices[0].message.content;
    console.log(content);

    await addMessage(content, "assistant");
  }
} catch (err) {
  if (err.name === "ExitPromptError") {
    console.log("\n再會~");
  } else {
    throw err;
  }
}