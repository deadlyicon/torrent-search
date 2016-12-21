import cloudscraper from 'cloudscraper'
import cheerio from 'cheerio'

export default function request(method, url){
  if (process.env.verbose)
    console.log(`REQUEST ${method} ${url}`)
  return new Promise(function(resolve, reject){
    cloudscraper[method.toLowerCase()](url, function(error, response, body) {
      if (error) return reject(error)
      resolve(cheerio.load(body))
    })
  })
}
