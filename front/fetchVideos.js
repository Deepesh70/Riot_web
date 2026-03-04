const fs = require('fs');

async function fetchAll() {
    console.log("Fetching agents...");
    const res = await fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true');
    const { data } = await res.json();
    const map = {};

    for (let agent of data) {
        let name = agent.displayName.toLowerCase().replace('/', '');
        if (name === 'kayo') name = 'kayo';
        console.log(`Fetching videos for ${agent.displayName} (${name})...`);
        try {
            const valRes = await fetch(`https://playvalorant.com/en-gb/agents/${name}/`);
            if (valRes.ok) {
                const text = await valRes.text();
                // look for video URLs ending in mp4
                // the URLs are like "https://cmsassets.rgpub.io/..."
                const matches = text.match(/https:\/\/[^"]*\.mp4/g);
                if (matches && matches.length > 0) {
                    const unique = [...new Set(matches)];
                    map[agent.uuid] = unique; // store all to select the best one later
                    console.log(`-> Found: ${unique.length} videos`);
                } else {
                    console.log(`-> No videos found.`);
                }
            } else {
                console.log(`-> HTTP ${valRes.status}`);
            }
        } catch (e) {
            console.error(`-> Error: ${e.message}`);
        }
    }
    fs.writeFileSync('agentMap.json', JSON.stringify(map, null, 2));
    console.log("Saved to agentMap.json!");
}

fetchAll();
