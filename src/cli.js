#!/usr/bin/env node

import torrentSearch from '.'
import temp from 'temp'
import child_process from 'child_process'

const exec = child_process.exec

temp.track()

const query = process.argv[2] || ''

// torrentSearch(query, 0)
//   .then(torrents => {
//     torrents.length = 3
//     console.log(torrents)
//     return torrentSearch.magnetLinksForTorrents(torrents)
//   })
Promise.resolve([
  { name: 'Shameless US S07E12 HDTV x264 LOL ettv',
    href: '/6fa8e6dd34842f8919f6a28f0ee24e59270a0a6e/Shameless-US-S07E12-HDTV-x264-LOL-ettv-torrent.html',
    seeders: 3460,
    size: '468 Mb  ',
    age: ' 2 days ago',
    verified: true,
    type: 'torrentproject.se'
  },
  { name: 'Shameless US S07E10 HDTV x264 LOL ettv',
    href: '/723bf1767f9b9ad3b66644f644b131f4e879d83b/Shameless-US-S07E10-HDTV-x264-LOL-ettv-torrent.html',
    seeders: 2336,
    size: '441 Mb  ',
    age: ' 16 days ago',
    verified: true,
    type: 'torrentproject.se'
  },
  { name: 'Shameless US S07E11 HDTV x264 LOL ettv',
    href: '/6ad2b4d62d34116c14efac27d6fccd15e2b6a708/Shameless-US-S07E11-HDTV-x264-LOL-ettv-torrent.html',
    seeders: 1876,
    size: '446 Mb  ',
    age: ' 9 days ago',
    verified: true,
    type: 'torrentproject.se'
  },
  { name: 'Shameless.US.S07E12.HDTV.XviD-FUM[ettv]',
    href: '/torrent/cqzfs9m',
    created_at: '2016-12-19 04:53:14',
    size: '497.69 MB',
    seeders: '318',
    leechers: '25',
    type: 'rarbg.to'
  },
  { name: 'Shameless.US.S07E12.HDTV.x264-LOL[ettv]',
    href: '/torrent/p6h3zbv',
    created_at: '2016-12-19 04:03:24',
    size: '468.22 MB',
    seeders: '1086',
    leechers: '304',
    type: 'rarbg.to'
  },
  { name: 'Shameless.US.S07E12.720p.HDTV.X264-DIMENSION[rartv]',
    href: '/torrent/o5btw21',
    created_at: '2016-12-19 03:59:46',
    size: '1.26 GB',
    seeders: '283',
    leechers: '39',
    type: 'rarbg.to'
  }
])
  .then(torrents => {
    return torrentSearch.magnetLinksForTorrents(torrents)
  })
  .then(magnetLinks => {
    console.log('magnetLinks', magnetLinks)
  })





// temp.open('torrent-search', function(error, info) {
//   if (error) throw error
//   console.log(info)
//   fs.write(info.fd, myData);
//   // fs.close(info.fd, function(err) {
//   //   exec("grep foo '" + info.path + "' | wc -l", function(err, stdout) {
//   //     util.puts(stdout.trim());
//   //   });
//   // });
// });
