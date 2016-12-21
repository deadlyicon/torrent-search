#!/usr/bin/env node

import fs from 'fs'
import torrentSearch from '.'
import sprintf from 'sprintf'
import temp from 'temp'
import child_process from 'child_process'

const exec = child_process.exec

temp.track()

const query = process.argv[2] || ''

torrentSearch({query, page:1}, 0)
  .then(torrents => {
    console.log(torrents)
    // throw new Error('fuck')
    return torrents
  })
  .then(prompt)
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

// TODO make this its own npm package named file-prompt
function prompt(torrents){
  return new Promise((resolve, reject) => {
    temp.open('torrent-search', function(error, info) {
      if (error) return reject(error)
      fs.write(info.fd, torrentsToPromptText(torrents), "utf-8",  function(error) {
        if (error) return reject(error)
        fs.close(info.fd, function(error) {
          if (error) return reject(error)
          child_process.exec(`$EDITOR '${info.path}'`, function(error, stdout) {
            const promptText = fs.readFileSync(info.path, "utf-8")
            resolve(promptTextToTorrents(promptText))
          })
        });
      });
    });
  })
}


function torrentsToPromptText(torrents){
  return torrents.map(torrent => {
    const args = {
      ...torrent,
      name: torrent.name.replace(/\|/,'').substr(0,70),
      verified: (torrent.verified ? 'V' : ' '),
      json: JSON.stringify(torrent),
      age: torrent.age || torrent.created_at || '',
      sal: `${torrent.seeders}/${torrent.leechers}`
    }
    return sprintf(`# | %(verified)-1s | %(name)-70s | %(sal)-10s | %(age)-15s | %(href)-30s | JSON:%(json)s`, args);
  }).join("\n")
}

function promptTextToTorrents(promptText){
  return promptText
    .split("\n")
    .filter(line => !/^\s*(#|$)/.test(line))
    .map(line => line.split('| JSON:')[1])
    .map(JSON.parse)
}
