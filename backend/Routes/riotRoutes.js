import express from 'express';
import { getRiotAccount, getLolMatches, getValMatches, getValAccount, analyzeSmurf, analyzePlaystyle } from '../Controllers/riotController.js';

const router = express.Router();

router.get('/account/:gameName/:tagLine', getRiotAccount);
router.get('/matches/lol/:puuid', getLolMatches);
router.get('/matches/val/:name/:tag', getValMatches);
router.get('/val/account/:name/:tag', getValAccount);
router.get('/val/smurf-analyze/:name/:tag', analyzeSmurf);
router.get('/val/playstyle/:name/:tag', analyzePlaystyle);

export default router;
