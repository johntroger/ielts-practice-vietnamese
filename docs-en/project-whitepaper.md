# 🏛️ How the Platform Works & Project Whitepaper

> **Version**: `v3.5 (2026 Living Edition)` | **Last Updated**: `2026-11-01`  
> **Platform Scale**: **45+ specialized features** | **Architecture**: `Local-First (90%) + Cloud & AI Examiner (10%)`

[← Back to Handbook Home](README.md) • [Explore 45+ Platform Features ↗](features/README.md)

---

## 1. One-Sentence Product Definition (Elevator Pitch)

> 💡 **Core Value Proposition:**  
> IELTS Studio is an all-in-one Computer-Delivered IELTS (CDI) simulation room, 4-skill practice studio, personalized 30-minute sprint coach, and gamified vocabulary arena running directly in the browser — combining a 0.02ms deterministic algorithmic scorer with a 4-criteria Cambridge AI Examiner.

### 📊 Direct Comparison: Traditional Centers vs. Legacy Test Sites vs. IELTS Studio Platform

| Dimension | Traditional Offline Centers | Legacy Online Test Sites | IELTS Studio Platform (This Project) |
| :--- | :--- | :--- | :--- |
| **Cost to Learner** | $600 – $2,500 per course | Pay-per-essay or static free tests | **Accessible Freemium (Unlimited 0.02ms grading + all-in-one tools)** |
| **Writing & Speaking Grading Speed** | 2 to 7 days waiting for teacher | 15 – 40 seconds API wait (often timeouts) | **0.02ms Instant Algorithmic Scorer + Deep 4-Criteria AI Examiner** |
| **CDI Computer Exam Simulation** | Mostly paper-based handouts | Standard blog-style web layout | **1:1 Authentic CDI Split-Screen, Highlight/Notes, Contrast & Shortcuts** |
| **Reading & Listening Explanations** | Manual classroom review | Only shows Correct/Wrong key | **Distractor Trap Decoder explaining psychological traps & evidence** |
| **Daily Retention & Gamification** | Depends purely on willpower | High drop-off after 1–2 tests | **Atlas Arena (90s Duels, Tower of Babel, Boss Raids, Leagues & Streaks)** |
| **Server & AI Unit Economics** | High rent & teacher payroll | High API token burn on every click | **Saves 85–90% server/API cost via Local-First 90% client processing** |

---

## 2. How the Website Operates – 5-Step Closed-Loop User Journey

The platform operates as a **Closed-Loop Pedagogical Engine** across 5 interconnected stages, guiding learners seamlessly from Day 1 onboarding to official exam readiness:

### Step 01: Diagnostic & Onboarding (`Day 1 Entry`)
- **👤 User Action**: Complete beginners click "🌱 Beginner Hub" for a gentle 4-step path (90s vocabulary game, IELTS jargon buster, 3-minute simple sentences). Intermediate learners take the 10-minute Diagnostic Placement Test.
- **⚙️ Under-the-Hood System Engine**: The Diagnostic Placement Engine evaluates grammar, lexical range, and reading comprehension to calculate current Band level and generate a personalized 30-Day Roadmap.
- **🎯 Pedagogical Value**: Eliminates overwhelm on Day 1. Every learner knows immediately where to start according to their Target Band (5.0 to 8.0+).

### Step 02: Adaptive 30-Min Daily Sprint (`Daily Habit`)
- **👤 User Action**: Open the "Adaptive 30-Min Sprint Coach" or click the "Smart Daily Recommendation" card at the top of the workspace.
- **⚙️ Under-the-Hood System Engine**: Scans personal Mistake Vault and recent submission history to divide 30 minutes into 3 brain-optimized stages: Stage 1 (7m Grammar Trap Clearing) ➔ Stage 2 (15m Core Speaking/Writing Sprint) ➔ Stage 3 (8m C1/C2 Lexical Boost).
- **🎯 Pedagogical Value**: No more wondering what to study today. Turns 30 spare minutes into targeted daily band improvement with Streak tracking.

### Step 03: 4-Skill Authentic CDI Workspaces & Arena (`Core Practice`)
- **👤 User Action**: Practice Writing, Speaking, Reading, and Listening on a 1:1 Computer-Delivered IELTS interface, or enter the 90-second Atlas English Arena.
- **⚙️ Under-the-Hood System Engine**: Runs real-time GRA sentence structure heatmaps, PEEL paragraph coherence checks, 1-click C1/C2 lexical upgrades, 60 FPS audio waveform & filler-word detection, and split-screen passage highlighting.
- **🎯 Pedagogical Value**: Builds 100% familiarity with official IDP/British Council computer exam software while keeping daily practice engaging.

### Step 04: Dual-Engine Grading & Trap Decoding (`0.02ms + AI`)
- **👤 User Action**: Click "Submit" to choose between Instant Algorithmic Grading (0.02ms) or Deep 4-Criteria Cambridge AI Examiner Evaluation.
- **⚙️ Under-the-Hood System Engine**: Scores Task Response, Coherence, Lexical Resource, and Grammar with a 4-axis Radar Chart, provides Band 8.0+ model rewrites, and activates the Distractor Trap Decoder for wrong Reading/Listening answers.
- **🎯 Pedagogical Value**: Instant feedback without waiting days for a tutor. Learners understand the exact psychological trap behind every mistake.

### Step 05: SRS Mistake Prescription & TRF Exam (`Mastery Loop`)
- **👤 User Action**: Complete the 3-minute "Daily Error Prescription" quiz the next day and take the 3-Skill Marathon Mock Test.
- **⚙️ Under-the-Hood System Engine**: Automatically converts yesterday’s real errors in the Mistake Vault into Spaced Repetition (SRS) reflex quizzes, generates an official-style PDF Test Report Form (TRF) with QR verification, and predicts the exact date of reaching Target Band.
- **🎯 Pedagogical Value**: Ensures past mistakes are permanently cured before exam day and provides clear data on when to book the real IELTS test.

---

## 3. Hybrid Technical Architecture (Local-First 90% + Cloud & AI 10%)

Our architecture eliminates server bottlenecks and reduces API unit costs by 85–90% through intelligent client-edge processing:

### 🛡️ Local-First Client Edge (Browser & IndexedDB)
> **LAYER 1 • 90% WORKLOAD ON USER DEVICE** — *Zero server latency, offline resilience, and $0 marginal compute cost*

- ⚡ 0.02ms Deterministic Algorithmic Scorer: Evaluates CEFR vocabulary density, GRA complex sentence ratios, linker variety, WPM speaking pace, and filler words directly in the browser.
- 💾 Two-Tier Local Persistence (IndexedDB + LocalStorage): Auto-saves essays every millisecond and stores voice recordings locally. Even if Wi-Fi drops during a 3-hour marathon exam, zero work is lost.
- 🎙️ 60 FPS Web Audio & Strict Bilingual Engine: Real-time acoustic waveform visualization and instant switching between 100% Vietnamese and 100% International English UI.

### 🛡️ Cloud & AI Examiner Layer (Supabase + Cloudflare + LLM)
> **LAYER 2 • 10% HIGH-VALUE INTELLIGENCE & SYNC** — *Deep semantic evaluation, real-time leaderboards, and cross-device backup*

- 🤖 Deep 4-Criteria Cambridge AI Examiner: Activated on-demand for semantic argument grading, PEEL logic verification, sentence-by-sentence correction, and Band 8.0+ model rewrites.
- ☁️ Supabase Real-Time Cloud & Guest Migration: Seamlessly migrates guest progress to cloud accounts, powers live Atlas Arena leaderboards, and syncs Streak Shields across devices.
- 🛡️ Cloudflare Edge & Automated SSOT Pipeline: Delivers low-latency audio tracks globally and auto-synchronizes all feature documentation from a Single Source of Truth (featureRegistry.js).

---

## 4. Living Product & Growth Roadmap

This roadmap is continuously updated as new capabilities and test banks ship to production:

### 🚀 Phase 1 (Completed & Live) — Core 4-Skill CDI Studio, Dual-Engine Grading & Atlas Arena (`v1.0 – v3.5 (Current)` • `100% Live in Production`)
- 45+ specialized features across Writing, Speaking, Reading, and Listening.
- 0.02ms Algorithmic Scorer + 4-Criteria Cambridge AI Examiner with PEEL & GRA Heatmap.
- 100-Level Atlas Titans Arena, Tower of Babel, Ghost Duels, and Streak Shield economy.
- 100% Strict Global English UI & Bilingual GitBook auto-sync pipeline.

### 🚀 Phase 2 (Ongoing Evolution) — Cambridge Question Bank Expansion & Adaptive Personalization (`Q4 2026 – Q1 2027` • `In Active Expansion`)
- Continuous quarterly addition of authentic Cambridge-calibrated Reading, Listening, Writing, and Speaking test sets.
- Enhanced Ebbinghaus 14-day memory decay tracking across Mistake Vault and SRS Vocabulary Studio.
- Deep diagnostic analytics and automated daily study prescriptions tailored to individual band bottlenecks.

### 🚀 Phase 3 (Upcoming Milestone) — Classroom / Center Management Hub (B2B SaaS) & Multi-Accent AI (`Q2 – Q3 2027` • `Planned Roadmap`)
- Teacher & Institution Dashboard enabling schools and IELTS centers to assign CDI mock exams and track class-wide error analytics.
- Multi-accent Speaking Examiner simulation (British, Australian, North American) with prosody coaching.
- Progressive Web App (PWA) & tablet optimization for computer lab deployments.

### 🚀 Phase 4 (Long-Term Vision) — Global EdTech Ecosystem & Multi-Certificate Expansion (`2027 – 2028` • `Global Scaling`)
- Zero-friction international rollout across Southeast Asia, South Asia, and global EFL markets leveraging the 100% English UI engine.
- Cloning the Local-First Dual-Engine architecture to adjacent academic assessments (PTE Academic, TOEIC 4-Skills, SAT).

---
*Automatically synchronized from `src/core/projectWhitepaperData.js` and `src/core/featureRegistry.js`. Explore the [Platform Feature Overview](features/README.md).*
