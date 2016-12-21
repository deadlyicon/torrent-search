#!/usr/bin/env node

import torrentSearch from '.'
import temp from 'temp'
import child_process from 'child_process'

const exec = child_process.exec

temp.track()

const query = process.argv[2] || ''

torrentSearch(query, 0)
  .then(torrents => {
    torrents.length = 3
    return torrents
  })
  .then(torrents =>
    torrentSearch.magnetLinksForTorrents(torrents)
  )
  .then(magnetLinks => {
    magnetLinks.forEach(magnetLink => {
      console.log(magnetLink)
    })
  })
  .catch(error => {
    console.error(error)
  })
