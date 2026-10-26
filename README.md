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

## Current role abilities

Each game assigns one unique role to each human player from this eight-role pool:

- **Vampire:** +1 coin for each distinct human deal partner per game.
- **Werewolf:** +1 for each successful Risky Deal, maximum four bonuses.
- **Mummy:** +1 for each successful Basic Deal, maximum three bonuses.
- **Ghost:** +1 when another player explicitly rejects the Ghost's offer.
- **Detective:** one private exact-role investigation per night; each human deal partner loses 1 coin, at most once per night.
- **Serial Killer:** after the second successful deal with a target, may choose to make that target lose 2 coins while gaining 2 bonus coins. One activation per target.
- **Zombie:** successful deal partners become infected immediately. Players infected earlier spread infection to their own deal partners at the end of the following night. If every roster participant, including the Robot, is infected at game end, the original Zombie wins alone.
- **Dragon:** +3 for a successful deal with a player who explicitly rejected another offer during the immediately preceding night; maximum two activations.

Role decisions, deal outcomes, coin adjustments, investigation history, rejection records, and infection scheduling are validated and maintained on the server. The in-game **? / My Role** button displays private role rules and current progress. Detective history remains available across night transitions and ordinary reconnects while the room exists in memory.

The Robot chooses a target from current lowest/highest balances and uses configurable-in-code random choices for deal type and Split/Steal. Its behavior is intentionally simple and does not inspect roles or private chat. Private messages are routed only to the two participants after a mutually accepted deal, and are disabled outside the night phase. Chat messages are limited to 300 characters and rate-limited.

Room state is in memory. It survives ordinary client reconnects while the server process remains alive, but not a complete server restart. A persistent store and stronger session-token scheme would be needed before treating this as a production service for strangers.

## Testing status

`npm test` runs the Risky Deal payout tests and unit tests for role-system predicates. Syntax checks should also be run for the server and frontend. These automated tests do not replace full multiplayer playtesting.

- Test three and eight humans, host disconnects, and a server restart.
- Test every payout combination and the mixed Basic/Risky offer rule.
- Test simultaneous offers, rejection, passing, timer expiry, reconnects, and private-message isolation.
- Test all role bonuses and final scoring with several complete six-night games.

## Custom lobby timing

The room host can now set the role-reveal, night-phase, and morning/table-review durations in the lobby before starting. Settings are synchronized to everyone in the room and validated by the server.
