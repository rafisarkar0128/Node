// const { Player, Track } = require("lavalink-client");

/**
 * A function to add new songs to an empty queue if autoplay feature is enabled
 * @param {Player} player The player instance.
 * @param {Track} lastTrack The last played track.
 * @returns {Promise<void>} A promise that resolves when the function is done.
 */
async function autoPlayFunction(player, lastTrack) {
  if (!player.get("autoplay")) return;
  if (!lastTrack) return;

  if (lastTrack.info.sourceName === "spotify") {
    const filtered = player.queue.previous
      .filter((v) => v.info.sourceName === "spotify")
      .slice(0, 5);
    const ids = filtered.map(
      (v) =>
        v.info.identifier ||
        v.info.uri.split("/")?.reverse()?.[0] ||
        v.info.uri.split("/")?.reverse()?.[1]
    );

    if (ids.length >= 1) {
      const res = await player
        .search(
          {
            query: `seed_tracks=${ids.join(",")}`,
            source: "spotify"
          },
          lastTrack.requester
        )
        .then((response) => {
          response.tracks = response.tracks.filter(
            (v) => v.info.identifier !== lastTrack.info.identifier
          );

          return response;
        })
        .catch(console.warn);

      if (res && res.tracks.length > 0)
        await player.queue.add(
          res.tracks.slice(0, 10).map((track) => {
            track.pluginInfo.clientData = {
              ...(track.pluginInfo.clientData || {}),
              fromAutoplay: true
            };
            return track;
          })
        );
    }

    return;
  }

  // Incorrect: This condition only checks for "youtube"
  // if (lastTrack.info.sourceName === ("youtube" || "youtubemusic"))

  // Correct: Checks both conditions separately
  // if (lastTrack.info.sourceName === "youtube" || lastTrack.info.sourceName === "youtubemusic")

  // Even clearer and cleaner: Using .includes()
  // if (["youtube", "youtubemusic"].includes(lastTrack.info.sourceName))

  if (["youtube", "youtubemusic"].includes(lastTrack.info.sourceName)) {
    const res = await player.search(
      {
        query: `https://www.youtube.com/watch?v=${lastTrack.info.identifier}&list=RD${lastTrack.info.identifier}`,
        source: "youtube"
      },
      lastTrack.requester
    );
    res.tracks = res.tracks.filter(
      (t) => t.info.identifier !== lastTrack.info.identifier
    );

    if (res && res.tracks.length > 0)
      await player.queue.add(
        res.tracks.slice(0, 10).map((track) => {
          (track.requester = lastTrack.requester),
            (track.pluginInfo.clientData = {
              ...(track.pluginInfo.clientData || {}),
              fromAutoplay: true
            });

          return track;
        })
      );

    return;
  }

  if (lastTrack.info.sourceName === "jiosaavn") {
    const res = await player.search(
      { query: `jsrec:${lastTrack.info.identifier}`, source: "jsrec" },
      lastTrack.requester
    );

    if (res.tracks.length > 0) {
      const track = res.tracks.filter(
        (v) => v.info.identifier !== lastTrack.info.identifier
      )[0];
      await player.queue.add(track);
    }
  }

  return;
}

module.exports = autoPlayFunction;
