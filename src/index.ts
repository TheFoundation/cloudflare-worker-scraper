import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { TidyURL } from 'tidy-url'

import {
  generateErrorJSONResponse,
  generateJSONResponse,
} from './json-response'
import { linkType } from './link-type'
import Scraper from './scraper'
import { scraperRules } from './scraper-rules'

export interface Response<T> {
  code: number
  message: string
  data: T
}

type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue }

interface JSONObject {
  [k: string]: JSONValue
}

export type ScrapeResponse = string | string[] | JSONObject

const app = new Hono()

app.get('/', async (c) => {
  const { token } = env<{ token: string }>(c)
  let url = c.req.query('url')
  const cleanUrl = c.req.query('cleanUrl')

  const scraper = new Scraper()
  let response: Record<string, ScrapeResponse>

  const Authorization = c.req.header('Authorization')
  if (token) {
    if (!Authorization) {
      return c.json({
        code: 401,
        message: 'Unauthorized',
      } as Response<null>)
    }

    if (Authorization !== `Bearer ${token}`) {
      return c.json({
        code: 401,
        message: 'Unauthorized',
      } as Response<null>)
    }
  }

  if (!url) {
    return c.json({
      code: 400,
      message: 'Bad Request',
      data: 'Please provide a `url` query parameter, e.g. ?url=https://example.com',
    } as Response<string>)
  }

  if (url && !url.match(/^[a-zA-Z]+:\/\//)) {
    url = 'https://' + url
  }

  try {
    const requestedUrl = new URL(url)

    // If the url is a reddit url, use old.reddit.com because it has much
    // more information when scraping
    if (url.includes('reddit.com')) {
      requestedUrl.hostname = 'old.reddit.com'
      url = requestedUrl.toString()
    }

    await scraper.fetch(url)
  } catch (error) {
    return generateErrorJSONResponse(error, url)
  }

  try {
    // Get metadata using the rules defined in `src/scraper-rules.ts`
    response = await scraper.getMetadata(scraperRules)

    const unshortenedUrl = scraper.response.url

    // Add cleaned url
    if (cleanUrl) {
      const cleanedUrl = TidyURL.clean(unshortenedUrl || url)
      response.cleaned_url = cleanedUrl.url
    }

    // Add unshortened url
    response.url = unshortenedUrl

    // Add url type
    response.urlType = linkType(url, false)

    // Parse JSON-LD
    if (response?.jsonld) {
      response.jsonld = JSON.parse(response.jsonld as string)
    }
  } catch (error) {
    return c.json({
      code: 500,
      message: 'Internal Server Error',
    } as Response<null>)
  }

  return c.json({
    code: 200,
    message: 'OK',
    data: response as ScrapeResponse,
  } as Response<ScrapeResponse>)
})

export default app
