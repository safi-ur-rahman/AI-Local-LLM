# AI Local LLM Project

A high-performance, terminal-centric AI application utilizing a local microservices architecture. This project integrates a **Hono** backend with a locally hosted **Phi-3** model via **Ollama**, optimized for speed and industrial automation workflows.

## 🚀 Tech Stack

### Core Backend & AI
*   **Hono**: Lightweight, standard-compliant web framework used for API routing.
*   **Ollama (Phi-3)**: Local LLM runner for executing high-fidelity AI responses without external API costs.
*   **TypeScript**: Ensuring type safety across the service layer and LLM integrations.
*   **Pino**: High-performance structured logging with `pino-pretty` for clear terminal debugging.

### Environment & Tooling
*   **Bun**: Fast JavaScript all-in-one toolkit (Runtime, Package Manager, Bundler).
*   **ESLint (Flat Config)**: Modern linting standards using ESLint 10.
*   **Husky & lint-staged**: Automated pre-commit hooks to maintain code quality.

---

## ⚙️ Configuration

Create a `.env` file in the root directory (or within the `client` folder depending on your deployment) with the following variables:

```bash
# URL for the locally running Ollama instance
LOCAL_LLM_URL=http://localhost:11434

# Environment Mode
NODE_ENV=development
```

---

## 🚦 Getting Started

### 1. Prerequisites
Ensure you have **Ollama** installed and the **Phi-3** model pulled:
```bash
ollama pull phi3
```

### 2. Install Dependencies
Using **Bun** for maximum performance:
```bash
cd client
bun install
```

### 3. Run Development Server
```bash
bun dev
```

### 4. Verify Local LLM Connection
Test the streaming endpoint using `curl`:
```bash
curl -N -X POST http://localhost:3000/api/chat \
     -H "Content-Type: application/json" \
     -d '{"messages": [{"role": "user", "content": "Hello AI"}]}'
```

---

## 🛡️ Development Standards

*   **Logging**: Use `logger.info()` or `logger.error()` from `@/lib/logger` instead of `console.log` to maintain structured, timestamped logs.
*   **Commits**: All commits are checked by Husky. If linting fails due to ESLint Flat Config issues, ensure `@eslint/eslintrc` is installed.
