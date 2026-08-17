Running the Prototype

This is a quick guide to get the app running locally. The .env file already contains the required values, so there's no need to create or edit it.

Prerequisites
Node.js (v18 or later recommended) — check with node -v
A package manager: npm (comes with Node), or optionally yarn, pnpm, or bun
1) Open a terminal in the project folder

Navigate to the project root (the folder containing package.json):

bash
cd path/to/project
2) Install dependencies

Using npm:

bash
npm install

Using yarn:

bash
yarn install

Using pnpm:

bash
pnpm install

If the machine uses Bun:

bash
bun install
3) Start the app

Using npm:

bash
npm run dev

Using yarn:

bash
yarn dev

Using pnpm:

bash
pnpm dev

Using Bun:

bash
bun run dev

This runs the dev script defined in package.json, which launches the local Vite development server.

4) Open the app

Once the server starts, the terminal will print a local URL. By default, Vite runs at:

http://localhost:5173

Open that address in a browser.

If it does not start

Common causes:

Dependencies were not installed (re-run step 2)
The terminal is not in the project root (check with pwd / cd and confirm package.json is present)
The .env file is missing or not being loaded
Port 5173 is already in use by another app

If the port is busy, Vite will automatically suggest and use the next available port (e.g. 5174) — check the terminal output for the actual URL.
