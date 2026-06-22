import { configDotenv } from "dotenv";
import { OpenRouter } from '@openrouter/sdk';
import fs from "fs";
import { exec } from "child_process";
import { jsonrepair } from "jsonrepair";

configDotenv();

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

function openVSCode(folder) {
    exec(`code ${folder}`);
    console.log("VS Code Opened");
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
- If multiple actions are needed, return an array.

Example:

[
  {
    "tool": "openVSCode",
    "args": {
      "folder": "."
    }
  },
  {
    "tool": "createFile",
    "args": {
      "path": "sum.java"
    }
  }
]
`
            },
            {
                role: "user",
                content: "Open VS Code and create a file called add.java which take two no. and gives output of its sum you can take two no. as 3,4"
            }
        ]
    }
});

const content = response.choices[0].message.content;
// console.log("Content : ", content);

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
            const error = await runFile(action.args.path);
            if (error) {

                const fixResponse = await client.chat.send({
                    chatRequest: {
                        model: "meta-llama/llama-3-8b-instruct",
                        messages: [
                            {
                                role: "system",
                                content: "You are an expert programmer. Fix the code."
                            },
                            {
                                role: "user",
                                content: `
Code:

${action.args.content}

Compiler Error:

${error}

Return ONLY the corrected code.
`
                            }
                        ]
                    }
                });

                const fixedCode =
                    fixResponse.choices[0].message.content;

                writeFile(action.args.path, fixedCode);

                console.log("Retrying...");

                runFile(action.args.path);
            }

            break;

        default:
            console.log("Unknown tool");
    }
}