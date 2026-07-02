# Software Development Life Cycle (SDLC) for EA Online League

This document outlines the SDLC phases and processes for the EA Online League application.

## 1. Planning and Requirements Analysis
- Define the project goals and objectives.
- Identify the target audience and key features for the online league platform.
- Gather requirements for user management, tournament brackets, matchmaking, and leaderboards.

## 2. Design
- **System Architecture:** Design the backend services, databases, and third-party integrations (e.g., gaming APIs).
- **UI/UX Design:** Create wireframes and mockups for the web/mobile interface.
- **Database Schema:** Plan the structure for players, teams, matches, and statistics.

## 3. Implementation (Coding)
- Setup the development environment and version control.
- **Backend Development:** Build APIs, user authentication, and match logic.
- **Frontend Development:** Implement the user interface and connect it to backend services.

## 4. Testing
- **Unit Testing:** Verify individual components and functions.
- **Integration Testing:** Ensure seamless communication between frontend, backend, and external APIs.
- **User Acceptance Testing (UAT):** Beta testing with actual users to validate features and gameplay experience.

## 5. Deployment
- Setup CI/CD pipelines.
- Deploy the application to a staging environment for final review.
- Production release.

## 6. Maintenance and Optimization
- Monitor application performance and server health.
- Roll out regular updates, feature enhancements, and bug fixes based on user feedback.
- Scale infrastructure as the user base grows.

MASTER DEVELOPMENT PROMPT FOR ANTIGRAVITY AI CODER
Champions League Format Tournament Generator Web Application
PROJECT TITLE
Champions League Tournament Generator — AI‑Powered Fixture & Knockout Creator

PRIMARY OBJECTIVE
Build a user‑friendly web application where users enter player names and the system automatically generates a full Champions League–style tournament:

League phase (8 matches per player, pot‑based scheduling)

League table

Playoffs (positions 9–24)

Knockout bracket (R16 → QF → SF → Final)

Optional AI match simulation

Shareable final results

TECH STACK REQUIREMENTS
Frontend
React + Vite

TypeScript

TailwindCSS

React Router

State management: Zustand or Redux Toolkit

Backend
Node.js + Express (or NestJS if structure is preferred)

TypeScript

REST API

Service‑layer architecture

Validation using Zod or Joi

Database
PostgreSQL (Supabase or Neon)

Prisma ORM

AI / ML
Simple Elo‑based rating system

Optional ML microservice (FastAPI or TensorFlow.js)

Endpoints for match prediction and fixture balancing

CORE FEATURES TO IMPLEMENT
1. Tournament Setup
Create tournament

Add players

Auto‑assign pots (1–4)

Store player ratings (optional)

2. League Phase Fixture Generator
Implement the full algorithm:

Divide players into pots

Each player plays 8 matches

Opponent distribution:

2 from Pot 1

2 from Pot 2

2 from Pot 3

2 from Pot 4

No duplicate fixtures

Balanced home/away (4/4)

Matchday scheduling (no player appears twice per matchday)

3. League Table Engine
Compute:

Played

Wins / Draws / Losses

Goals For / Against

Goal Difference

Points

Ranking rules (GD → GF → head‑to‑head → random)

4. Knockout Phase Generator
Auto‑generate playoffs (9–24)

Two‑legged ties

Aggregate scoring

Winners join top 8 in Round of 16

Auto‑generate bracket:

R16

Quarterfinals

Semifinals

Final

5. AI Match Simulation
Elo rating system

Probability model

Scoreline generator

Endpoint: /simulate-match

6. UI Requirements
Build the following screens:

A. Create Tournament
Tournament name

Number of players

B. Add Players
Player name list

Optional rating input

C. League Fixtures
Matchday selector

Fixture list

Score input

“Simulate All” button

D. League Table
Full standings table

“Generate Knockout Phase” button

E. Knockout Bracket
Visual bracket

Score entry

Simulation buttons

Trophy screen for winner

DATABASE SCHEMA (Prisma)
User
id

email

name

Tournament
id

name

ownerId

status

Player
id

tournamentId

name

rating

pot

Fixture
id

tournamentId

stage

homePlayerId

awayPlayerId

matchday

leg

homeScore

awayScore

status

Standing
id

tournamentId

playerId

played

wins

draws

losses

gf

ga

gd

points

KnockoutTie
id

tournamentId

stage

homePlayerId

awayPlayerId

aggregateHome

aggregateAway

winnerId

API ENDPOINTS
Tournament
POST /tournaments

GET /tournaments/:id

Players
POST /tournaments/:id/players

GET /tournaments/:id/players

League Fixtures
POST /tournaments/:id/fixtures/league-generate

GET /tournaments/:id/fixtures?stage=league

PATCH /fixtures/:id (update score)

Standings
GET /tournaments/:id/standings

Knockout
POST /tournaments/:id/knockout/generate

GET /tournaments/:id/knockout

PATCH /knockout/:id (update score)

AI
POST /ai/predict

POST /ai/simulate-match

FRONTEND FILE STRUCTURE
Code
src/
  components/
    TournamentForm/
    PlayerForm/
    LeagueFixtures/
    LeagueTable/
    KnockoutBracket/
  pages/
    HomePage.tsx
    CreateTournamentPage.tsx
    TournamentPage.tsx
  api/
    tournaments.ts
    players.ts
    fixtures.ts
    standings.ts
    knockout.ts
    ai.ts
  hooks/
    useTournament.ts
    useFixtures.ts
    useStandings.ts
    useKnockout.ts
  utils/
    elo.ts
    fixtureGenerator.ts
    bracketGenerator.ts
DEVELOPMENT PHASES
Phase 1 — Backend Foundations
Implement DB schema

Implement tournament + player endpoints

Implement fixture generation service

Phase 2 — League Phase
League fixtures UI

Score entry

Standings engine

Phase 3 — Knockout Phase
Playoff generator

Bracket generator

Knockout UI

Phase 4 — AI Layer
Elo rating system

Match simulation endpoint

UI integration

Phase 5 — Polish
Animations

Shareable results

Trophy screen

FINAL INSTRUCTION TO ANTIGRAVITY AI CODER
Generate all required code, files, services, components, and logic to fully implement the above system.
Follow best practices, ensure modular architecture, and produce production‑ready code.
