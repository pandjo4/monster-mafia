# Monster Mafia

A browser-based, dark-noir multiplayer negotiation game built with HTML, CSS, vanilla JavaScript, Node.js, Express, and Socket.IO. Rooms and game state are held in memory; no database or API key is required.

## Requirements

- Node.js 20 or newer
- npm
- A browser with JavaScript enabled

## Run locally

1. Download or clone this repository.
2. Open a terminal in the `monster-mafia` project folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the server:

   ```bash
   npm start
   ```

5. Visit `http://localhost:3000`.
6. Open the site in at least three separate browser sessions (incognito windows or other devices work well), create a room, and join using its code.

For a quick health check, open `http://localhost:3000/health`.

## GitHub setup

1. Create a new empty repository on GitHub named `monster-mafia`.
2. In this folder, run:

   ```bash
   git init
   git add .
   git commit -m "Build Monster Mafia multiplayer game"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/monster-mafia.git
   git push -u origin main
   ```

   Replace `YOUR-USERNAME` with your GitHub username. Alternatively, upload the files through GitHub's website while preserving the folder structure.

## Deploy to Render

1. Sign in to Render and choose **New → Web Service**.
2. Connect the GitHub repository.
3. Choose the Node runtime.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `npm start`.
6. No environment variables are required. Render supplies `PORT` automatically.
7. Deploy, open the generated URL, and test with at least three browser sessions on different devices.

Socket.IO uses the same HTTP server and port as the website. Render's free instances may sleep or restart, and an in-memory room is lost if the process restarts. Players can reconnect to a seat after a temporary browser disconnect while the same server process is still alive; reconnection cannot restore a room destroyed by a server restart.

## Rules overview

- 3–8 human players; the server adds one Robot.
- Six nights. Role reveal is 30 seconds, each night up to 90 seconds, and each morning report about 10 seconds.
- Basic Deal: 2 coins each. Risky Deal: Split/Split 3/3, Split/Steal 0/4, Steal/Split 4/0, Steal/Steal 1/1.
- A deal requires acceptance. A player can complete at most one deal per night. Passing locks that player for the night.
- The Robot loses one coin each night and receives one bonus coin for each distinct human who offers it a deal. It targets a lowest- or highest-balance eligible human.
- If the Robot finishes tied for last or outright last, the result is collective defeat. Otherwise, the highest-scoring human wins unless the Robot is uniquely first, in which case the Robot wins.

## Implemented balancing and simplifications

- Every role has one ability and a modest +2 secret-objective reward. Ability bonuses are tallied separately from deal income.
- Vampire, Werewolf, Fixer, Ghost, Counterfeiter, and Guardian bonuses are handled server-side. Detective can inspect a previous-night deal category; the guess tracking is a minimal first-version implementation and the client does not yet provide a dedicated guess panel. Mimic's once-per-game target selection is automatic on its first accepted deal rather than a separate target-pick screen.
- The Robot chooses a target from current lowest/highest balances and uses configurable-in-code random choices for deal type and Split/Steal. Its behavior is intentionally simple and does not inspect roles or private chat.
- Private messages are routed only to the two participants after a mutually accepted deal, and are disabled outside the night phase. Chat messages are limited to 300 characters and rate-limited.
- Room state is in memory. Use a persistent store and a stronger session-token scheme before treating this as a production service for strangers.

## Important testing note

This repository is a complete playable first implementation, but you should run the multiplayer scenarios below before inviting a group. Do not assume every edge case has been proven just because the app starts.

- Test three and eight humans, host disconnects, and a server restart.
- Test every payout combination and the mixed Basic/Risky offer rule.
- Test simultaneous offers, rejection, passing, timer expiry, reconnects, and private-message isolation.
- Test all role bonuses and final scoring with several complete six-night games.
