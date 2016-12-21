import sources from './sources'

/*

torrent = {
  name: String,
  href: String,
  leechers: Number,
  seeders: Number,
  size: String,
  age: Number,
  verified: Boolean,
  created_at: String,
}
*/

export default function torrentSearch(query, page=1){
  return Promise.all(
    Object.keys(sources).map(source =>
      sources[source].search(query, page)
    )
  ).then(results => {
    let torrents = []
    while (results.length) torrents = torrents.concat(results.shift())
    console.log(torrents.length)
    return torrents
  })
}


torrentSearch.magnetLinksForTorrents = function(torrents){
  return Promise.all(
    torrents.map(magnetLinkForTorrent)
  )
}

function magnetLinkForTorrent(torrent){
  return sources[torrent.type].magnetLinkForTorrent(torrent)
}
