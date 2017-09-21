#!/usr/bin/env node

const cli = require('commander')
const fs = require('fs')
const torrentSearch = require('.')
const sprintf = require('sprintf')
const temp = require('temp')
const child_process = require('child_process')
const chalk = require('chalk')

temp.track()
const exec = child_process.exec


cli
  .version(require('./package.json').version)
  .option('-h, --help', 'help', ()=>{
    cli.help()
    process.exit(1)
  })
  .option('-v, --verbose', 'verbose')
  .option('-p, --page <n>', 'page', Number)
  .option('-s, --sort <s>', 'sort', /(best|date|size|seeders|leechers)/)
  .option('-a, --asc', 'asc')
  .option('-P, --print', 'print')
  .parse(process.argv);

if (cli.verbose) process.env.verbose = '1'
const query = cli.args[0]
const page  = cli.page || 1
const sort  = cli.sort || 'best'
const desc  = !cli.asc
const print  = !!cli.print

if (process.env.verbose)
  console.log(chalk.blue(`searching for: `)+JSON.stringify(query))

torrentSearch({query, page, sort, desc})
  .then(torrents => {
    // torrents.length = 4
    console.log(`${torrents.length} torrents found`)
    // throw new Error('fuck')
    return torrents
  })
  .then(prompt)
  .then(torrents => {
    console.log(`seeking magnet links for ${torrents.length} torrents`)
    return torrents
  })
  .then(torrentSearch.magnetLinksForTorrents)
  .then(magnetLinks => {
    console.log(`found ${magnetLinks.length} magnet links`)
    magnetLinks.forEach(magnetLink => {
      if (print){
        console.log(magnetLink)
      }else{
        if (process.env.verbose) console.log(chalk.blue('opening'), magnetLink)
        child_process.spawn(`open`, [magnetLink], {stdio: 'inherit'})
      }
    })
    console.log("DONE GOOD!")
    process.exit(0)
  })
  .catch(error => {
    console.log('ERROR BAILING!')
    console.error(error)
    process.exit(1)
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
    const args = Object.assign({}, torrent, {
      name: torrent.name.replace(/\|/,'').substr(0,70),
      verified: (torrent.verified ? 'V' : ' '),
      json: JSON.stringify(torrent),
      age: torrent.age || torrent.created_at || '',
      sal: `${torrent.seeders}/${torrent.leechers}`
    })
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
