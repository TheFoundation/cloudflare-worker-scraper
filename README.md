# Metafy on Vercel

> Easily scrape metadata from websites as a service.

## Usage

Enter a valid `$URL` as params

```bash
curl https://metafy.xiaoluoboding.workers.dev/?url=$URL
```

## Example

### Input

```bash
curl https://metafy.xiaoluoboding.workers.dev/?url=https://onetab.group
```

### Output

```json
{
  "title": "One Tab Group: Your all-in-one tab/tab group manager for Chrome.",
  "description": "onetab.group is a chrome extension that allows you to manage your tabs & tab groups in one place. One-click to aggregate all tabs & tab groups into one session.",
  "author": "",
  "image": "https://onetab.group/preview.jpg",
  "feeds": [],
  "date": "",
  "lang": "",
  "logo": "https://onetab.group/logo.png",
  "video": "",
  "keywords": "",
  "jsonld": "",
  "url": "https://www.onetab.group/",
  "type": "link"
}
```

## Deploy your own instance

Deploy your `Metafy` on your own instance with one-click.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fone-tab-group%2Fvercel-metafy)

## Tech Stack

- [vercel](https://vercel.com/) - Develop. Preview. Ship. For the best frontend teams.
- [metascraper](https://metascraper.js.org/) - metascraper, easily scrape metadata from an article on the web.
- [typescript](https://www.typescriptlang.org/) - Typed JavaScript at Any Scale.
- [got](https://github.com/sindresorhus/got) - 🌐 Human-friendly and powerful HTTP request library for Node.js
- [esno](https://github.com/antfu/esno) - TypeScript / ESNext node runtime powered by esbuild

## License

MIT [xiaoluoboding](https://github.com/xiaoluoboding)
