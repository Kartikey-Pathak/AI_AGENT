import { configDotenv } from "dotenv";
import { OpenRouter } from '@openrouter/sdk';
import fs from "fs";
import { exec } from "child_process";
import { jsonrepair } from "jsonrepair";
import readline from "readline";

configDotenv();


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function runFile(path) {

    const extension = path.split(".").pop();

    let command = "";

    switch (extension) {

        case "js":
            command = `node ${path}`;
            break;

        case "py":
            command = `python ${path}`;
            break;

        case "java":
            const className = path.replace(".java", "");
            command = `javac ${path} && java ${className}`;
            break;

        default:
            console.log("Unsupported file type");
            return;
    }

    exec(command, (error, stdout, stderr) => {

        if (error) {
            console.log("Error:");
            console.log(stderr || error.message);
            // Later  send this back to the LLM
            return stderr;
        }

        console.log("Program Output:");
        console.log(stdout);
    });
}

function openVSCode(path) {
    exec(`code ${path}`);
    console.log(`${path} opened in VS Code`);
}

function createFile(path) {
    fs.writeFileSync(path, "");
    console.log(`${path} created`);
}

function writeFile(path, content) {
    fs.writeFileSync(path, content);
    console.log(`${path} written`);
}

const client = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
});


async function askAI(prompt) {

    const response = await client.chat.send({
        chatRequest: {
            model: "meta-llama/llama-3-8b-instruct",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `
You are an AI agent.

Available tools:

1. openVSCode(folder)
2. createFile(path)
3. writeFile(path, content)

IMPORTANT:
- Respond ONLY with valid JSON.
- Do not add explanations.
- Do not use markdown.
ALWAYS return an array.

Example:

[
  {
    "tool": "createFile",
    "args": {
      "path": "hello.txt"
    }
  },
  {
    "tool": "writeFile",
    "args": {
      "path": "hello.txt",
      "content": "Hello, World!"
    }
  }
]
  Available tools:

1. openVSCode(path) -> Opens a specific file or folder in VS Code.
2. createFile(path)
3. writeFile(path, content)

IMPORTANT:
- When a file is created and the user asks to open VS Code, call:

{
  "tool": "openVSCode",
  "args": {
    "path": "hello.py"
  }
}

- Never use "folder".
- Never leave path empty.
`
                },
                {
                    role: "user",
                    content: prompt
                }
            ]
        }
    });

    const content = response.choices[0].message.content;

    try {

        const fixed = jsonrepair(content);
        const actions = JSON.parse(fixed);

        console.log(actions);

        for (const action of actions) {

            switch (action.tool) {

                case "openVSCode":
                    openVSCode(action.args.folder);
                    break;

                case "createFile":
                    createFile(action.args.path);
                    break;

                case "writeFile":
                    writeFile(
                        action.args.path,
                        action.args.content
                    );

                    runFile(action.args.path);
                    break;

                default:
                    console.log("Unknown tool");
            }
        }

    } catch (err) {
        console.log("Failed to parse AI response");
        console.log(err);
        console.log(content);
    }
}

//Function to Take input from user in terminal till loop ends 
function startAgent() {

    rl.question("You: ", async (prompt) => {

        if (prompt.toLowerCase() === "exit") {
            console.log("Goodbye!");
            rl.close();
            return;
        }

        await askAI(prompt);

        // Ask again
        startAgent();
    });
}

startAgent();