# API Reference

All backend routes are mounted under `/api`.

## Authentication

- `POST /api/users/signup`
- `POST /api/users/login`
- `GET /api/users/profile`

## Riot data

- `GET /api/users/riot/account/:gameName/:tagLine`
- `GET /api/users/riot/matches/lol/:puuid`
- `GET /api/users/riot/matches/val/:name/:tag`
- `GET /api/users/riot/val/account/:name/:tag`
- `GET /api/users/riot/val/smurf-analyze/:name/:tag`
- `GET /api/users/riot/val/playstyle/:name/:tag`

## News

- `GET /api/news`

## Valorant

- `GET /api/valorant/agents`
- `GET /api/valorant/agents/:id`
- `GET /api/valorant/maps`
- `GET /api/esports/schedule`
