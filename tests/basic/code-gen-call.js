import pathModule from "path";
import fs from "fs-extra";
import OpenAI from "openai";

const __dirname = pathModule.resolve();

const key = await fs.readFile(
  pathModule.resolve(__dirname, "tmp", "open-ai", "secret-key.txt"),
  "utf8"
);

const client = new OpenAI({ apiKey: key });

const checkRelevance = async (user_input) => {
  const relevance_check = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a classifier that checks if a question is about programming in JavaScript.",
      },
      {
        role: "user",
        content: `Is the following query relevant? "${user_input}"`,
      },
    ],
  });

  if (
    !relevance_check.choices[0].message.content.toLowerCase().includes("yes")
  ) {
    console.log(
      "Query rejected. Please ask a question about JS variable declarations."
    );
    process.exit(1);
  }
};

const run = async (user_input) => {
  try {
    if (!user_input) {
      console.error("Please provide a user input.");
      process.exit(1);
    }

    await checkRelevance(user_input);

    const instructions = await fs.readFile(
      pathModule.resolve(__dirname, "tests", "basic", "prompt.txt"),
      "utf-8"
    );

    const response = await client.responses.create({
      model: "gpt-4.1",
      instructions,
      input: user_input,
    });

    console.log(response.output_text);
  } catch (err) {
    console.error("An error occurred:", err);
  }
};

// "Write prime number checking function"
// "What is fungi?"
// "How would I declare a variable for a last name?"
run("What is bacteria?");
