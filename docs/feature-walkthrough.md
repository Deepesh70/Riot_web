# 🚀 Feature Walkthrough: Riot ReImagined

This document provides a guided walkthrough of the user-facing and architectural features implemented in **Riot ReImagined**.

---

## 1. Cinematic Hero Section with ScrollTriggers

* **Visual Experience**: Dynamic multi-video background carousel featuring animated hero cards and titles powered by **GSAP**.
* **Micro-Interactions**: Hover tilt effects, custom cursor glints, and seamless transitions between media sections.
* **Audio Protocol**: Ambient audio engine managed by `AudioContext.jsx` with global mute/unmute control, persistent volume state, and interactive audio feedback.

---

## 2. Interactive Valorant Agent & Map Hub

* **Agent Roster**: Comprehensive agent browser with role filtering (Duelist, Initiator, Controller, Sentinel).
* **Ability Visualizers**: Interactive ability previews with video playback and cooldown/cost metrics.
* **Map Tactical Overviews**: High-resolution callout maps, site breakdowns (A, B, C sites), and tactical notes.

---

## 3. Real-Time Player Stats & Profile Tracker

* **Multi-Game Lookup**: Search players by Riot ID (`GameName#TagLine`) across Valorant and League of Legends.
* **Rank & Tier Badges**: Visual rank cards reflecting current tier (Iron through Radiant/Challenger), RR progress, and peak historical rank.
* **Recent Match History**: Detailed scoreboard breakdown including K/D/A, Econ rating, Headshot %, and match MVPs.

---

## 4. AI-Driven Smurf Detector

* **Algorithmic Evaluation**: Ingests recent competitive matches and feeds KD, ACS, and round differentials into the multidimensional K-Means clustering engine.
* **Risk Categorization**:
  * 🟢 **Normal Player**: Match performance aligns with registered tier distribution.
  * 🟡 **Elevated Performance**: Inconsistent high-kill outliers.
  * 🔴 **High-Probability Smurf**: Statistical performance consistently occupies the top-tier centroid across multiple games.

---

## 5. Security & Authentication Protocol

* **JWT Sessions**: Stateless authentication with encrypted tokens stored in browser local storage.
* **Rate Limiting**: IP-based rate limiting on all `/api/*` endpoints to defend against credential stuffing and DoS attacks.
* **Input Sanitization**: Request bodies sanitized and validated via `Middleware/validator.js`.
