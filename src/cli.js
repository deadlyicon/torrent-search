#!/usr/bin/env node

import cli from 'commander'
import fs from 'fs'
import torrentSearch from '.'
import sprintf from 'sprintf'
import temp from 'temp'
import child_process from 'child_process'

temp.track()
const exec = child_process.exec


cli
  .version(require('../package.json').version)
  .option('-h, --help', 'help', ()=>{
    cli.help()
    process.exit(1)
  })
  .option('-v, --verbose', 'verbose')
  .option('-p, --page <n>', 'page', Number)
  .option('-s, --sort <s>', 'sort', /(best|date|size|seeders|leechers)/)
  .option('-a, --asc', 'asc')
  .parse(process.argv);

const options = {
  query: cli.args[0],
  verbose: !!cli.verbose,
  page: cli.page || 1,
  sort: cli.sort || 'best',
  desc: !cli.asc,
}

torrentSearch(options)
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
    return sprintf(`# | %(verified)-1s | %(name)-70s | %(sal)-10s | %(age)-15s | %(size)-10s MB | %(href)-30s | JSON:%(json)s`, args);
  }).join("\n")
}

function promptTextToTorrents(promptText){
  return promptText
    .split("\n")
    .filter(line => !/^\s*(#|$)/.test(line))
    .map(line => line.split('| JSON:')[1])
    .map(JSON.parse)
}
