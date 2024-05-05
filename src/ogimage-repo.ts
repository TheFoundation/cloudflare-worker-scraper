export const checkIsRepo = (link: string) => {
  return /http(s):\/\/github.com\/(\S+)\/(\S+)/.test(link)
}

const createHash = (val: string) => {
  return crypto.subtle
    .digest('SHA-256', new TextEncoder().encode(val))
    .then((h) => {
      let hexes = [],
        view = new DataView(h)
      for (let i = 0; i < view.byteLength; i += 4)
        hexes.push(('00000000' + view.getUint32(i).toString(16)).slice(-8))
      return hexes.join('')
    })
}

export const getOriginalOGImageOfRepo = async (link: string) => {
  const test = link.match(/http(s):\/\/github.com\/(\S+)\/(\S+)/)
  // generate the 64 length hashcode from the link
  const hash = await createHash(link)
  if (!test) return ''
  const [, , author, repoName] = test
  return `https://opengraph.githubassets.com/${hash}/${author}/${repoName}`
}
