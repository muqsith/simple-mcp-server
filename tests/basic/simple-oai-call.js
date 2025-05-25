import pathModule from "path";
import fs from "fs-extra";

import OpenAI from "openai";

const __dirname = pathModule.resolve();
const key = await fs.readFile(
  pathModule.resolve(__dirname, "tmp", "open-ai", "secret-key.txt"),
  "utf8"
);

const client = new OpenAI({ apiKey: key });

const response = await client.responses.create({
  // model: "gpt-4.1",
  model: "o4-mini",
  input: "What is fungi?",
});

console.log(response.metadata);

console.log(response.output_text);
