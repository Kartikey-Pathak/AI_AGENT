# 🤖 Terminal AI Agent

A lightweight **AI-powered terminal agent** built with **Node.js, OpenRouter, and tool calling**, capable of creating files, generating code, executing programs, opening VS Code, and performing browser-based searches directly from natural language prompts.

The project demonstrates the fundamentals of **Agentic AI Systems** by combining LLM reasoning with real-world tool execution.

---

## 🚀 Features

### 📄 AI-Powered File Generation

Create files using natural language.

Example:

```bash
You: Create a file called hello.py that prints Hello World
```

The agent will:

* Create the file
* Generate the code
* Save it automatically

---

### 💻 Code Generation

Generate programs in multiple languages.

Supported:

* Java
* JavaScript
* Python
* Text files

Example:

```bash
You: Create add.java that prints the sum of two numbers
```

---

### ▶️ Automatic Code Execution

After generating code, the agent automatically runs the file.

Supported execution:

| Language   | Execution    |
| ---------- | ------------ |
| JavaScript | node         |
| Python     | python       |
| Java       | javac + java |

Example:

```bash
You: Create hello.py to print Hello Sir
```

Output:

```bash
Program Output:
Hello Sir
```

---

### 🛠 VS Code Integration

Open generated files directly inside VS Code.

Example:

```bash
You: Create server.js and open it in VS Code
```

---

### 🌐 Browser Search

Perform Google searches directly from the terminal.

Example:

```bash
You: Search best React projects on GitHub
```

The agent automatically opens Chrome with the search query.

---

### 💬 Natural Language Interface

Interact with your computer using plain English.

Examples:

```bash
Create a Java program for factorial.

Create a Python script to print prime numbers.

Search Google for MERN authentication tutorials.

Create a text file called notes.txt containing "Hello World".
```

---

## 🧠 How It Works

The application follows an **Agent + Tools architecture**.

```text
User Prompt
      ↓
OpenRouter LLM
      ↓
LLM decides required tools
      ↓
JSON Tool Response
      ↓
Node.js executes tools
      ↓
Output shown to user
```

Example tool response:

```json
[
  {
    "tool": "createFile",
    "args": {
      "path": "hello.py"
    }
  },
  {
    "tool": "writeFile",
    "args": {
      "path": "hello.py",
      "content": "print('Hello World')"
    }
  }
]
```

---

## ⚡ Available Tools

| Tool                       | Description                     |
| -------------------------- | ------------------------------- |
| `createFile(path)`         | Creates a new file              |
| `writeFile(path, content)` | Writes content into a file      |
| `openVSCode(path)`         | Opens a file/folder in VS Code  |
| `runFile(path)`            | Executes supported source files |
| `searchGoogle(query)`      | Opens Google search in Chrome   |

---

## 🛠 Tech Stack

* Node.js
* OpenRouter API
* LLaMA 3
* JavaScript
* Child Process API
* File System API
* Readline
* JSONRepair

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/terminal-ai-agent.git
```

```bash
cd terminal-ai-agent
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

```env
OPENROUTER_API_KEY=your_openrouter_api_key
```

---

## 🔑 Getting an OpenRouter API Key

1. Create an account at https://openrouter.ai
2. Generate an API key.
3. Add the key to your `.env` file.

---

## ▶️ Run the Agent

```bash
npm start
```

or

```bash
node index.js
```

---

## Example Session

```bash
You: Create a file called hello.py that prints Hello World

hello.py created
hello.py written

Program Output:
Hello World
```

---

## Project Goals

This project was built to learn:

* Agentic AI Systems
* LLM Tool Calling
* AI + Local Machine Interaction
* File System Automation
* Code Generation
* Terminal Automation
* OpenRouter Integration

---

## Future Improvements

* Internet search with API integration
* Automatic error fixing
* Project-wide code understanding
* Browser automation
* Memory and conversation history
* Multi-file editing
* Shell command execution
* GitHub repository search

---

## ⚠️ Disclaimer

This project executes actions on the local machine. Always review and understand the generated code before running it.

---

## 👨‍💻 Author

**Kartikey Pathak**

B.Tech CSE | Full-Stack Developer | AI & Web Enthusiast

If you found this project useful, consider giving it a ⭐ on GitHub.
