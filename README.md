# GHZIP — GitHub Repository Downloader

> A lightweight, self-hostable tool to download any public GitHub repository as a ZIP archive — securely, privately, and without exposing the source URL to the client.

---

## What is this?

GHZIP is a full-stack web application built with **Node.js** and **Express** that acts as a secure proxy between your browser and GitHub's CDN.

You paste a GitHub URL. The server parses it, verifies your access key, fetches the ZIP from GitHub on your behalf, and streams it directly to your browser — GitHub's internal CDN URL is never exposed to the client.

Simple idea. Real engineering underneath.

---

## How it works

```
Browser  →  POST /api/verify-key  →  Server checks key
Browser  →  GET  /api/download    →  Server fetches ZIP from GitHub CDN
                                              ↓
                                     Streams it back to browser
                                     (GitHub URL never exposed)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Server | Express.js |
| HTTP Client | node-fetch |
| Config | dotenv |
| Frontend | Vanilla HTML + CSS + JavaScript |

No frameworks. No build steps. No database. Just Node.

---

## Features

- Parses GitHub URLs automatically — supports both `github.com/owner/repo` and `github.com/owner/repo/tree/branch`
- Key-gated downloads — only authorized users can trigger a download
- Server-side proxy — GitHub's CDN URL is never sent to the browser
- Stream-based — ZIP is piped chunk by chunk, never fully loaded into server memory
- Clean UI — dark themed, responsive, real-time feedback

---

## Project Structure

```
├── server.js       — Express server, API routes, GitHub proxy logic
├── index.html      — Frontend UI with URL parser and auth flow
├── .env            — Environment config (not committed)
├── package.json
└── README.md
```

---

## Getting Started

**1. Clone the repo**
```bash
git clone https://github.com/Tashifur-Rahman/Github-Ziplfile-Downloader.git
cd ghzip
```

**2. Install dependencies**
```bash
npm install express node-fetch@2 dotenv
```

**3. Create a `.env` file**
```
PORT=3000
ACCESS_KEY=your-secret-key-here
```

**4. Run the server**
```bash
node server.js
```

**5. Open in browser**
```
http://localhost:3000
```

---

## Usage

1. Paste any public GitHub repository URL
2. The page instantly parses and shows the owner, repo, and branch
3. Enter your access key
4. Hit **Download ZIP** — the file lands in your downloads folder

---

## What I learned building this

- How Express routing works — `GET`, `POST`, `req.query`, `req.body`
- The difference between browser JavaScript and Node.js environments
- HTTP headers — `Content-Disposition`, `Content-Type`, and why they matter
- Stream piping — how to forward data without buffering it entirely in memory
- How GitHub's CDN URL structure works
- Securing routes with server-side key verification
- Why you never trust only the frontend for auth checks
- dotenv and environment-based configuration
- Debugging with `console.log` at each layer of a request

---

## Why it's key-gated

The access key exists to keep downloads controlled. If you're sharing a project privately — without making the GitHub repo public — you can host this tool and share only the key with people you trust. They get the file, your repo stays private.

---

## Limitations

- Works with **public** repositories only (no GitHub token auth in this version)
- No rate limiting — suitable for personal/small-team use
- Single access key for all users
