async function run() {
    const url = "https://api.henrikdev.xyz/valorant/v1/mmr-history/ap/Syth/COMET";
    const res = await fetch(url, {
        headers: {
            'Authorization': 'HDEV-2622cbe3-d45a-4027-b7c6-a93b6f1e213c',
            'Accept': '*/*'
        }
    });
    console.log(res.status);
    console.log(await res.text());
}
run();
