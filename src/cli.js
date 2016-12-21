#!/usr/bin/env node

import torrentSearch from '.'

torrentSearch(process.argv[2], 0)
  .then(torrents => {
    console.log(torrents)
    // torrents.forEach(torrent => {
    //   console.log(`${torrent.name}`)
    // })
  })
