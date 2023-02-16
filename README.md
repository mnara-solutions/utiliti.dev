# Utiliti

A collection of open source utilities hosted online at [utiliti.dev](https://utiliti.dev).

## Standards

- A set of fast and well-designed utilities.
- All compute will be done in-browser so that no data is sent back to us.
- If data needs to be sent to us (private notes), it will be end-to-end encrypted.
- No tracking.

## Tech Stack

- Built on top of [Remix](https://remix.run)
- Styled with [Tailwind](https://tailwindcss.com/)
- Hosted on [Cloudflare Pages](https://pages.cloudflare.com/) + Functions

Running a framework like Remix on Cloudflare Pages means that we utilize edge functions to deliver a server side rendered initial page. This increases the cost of hosting a project like this, but our users get a performance benefit and more importantly it unlocks more powerful utilities like private notes.

## Monetization

Each page will have a small, non-intrusive advertisement to cover the cost of hosting the project on Cloudflare.

## Local Development

To develop locally, you need to have a machine with `git` and `node 16.13.0` installed.

Clone this repository on your machine and run the following commands:

```sh
npm install
npm run dev
```

Open up [http://127.0.0.1:8788](http://127.0.0.1:8788) and you should be ready to go!

## Deployment

Deployment is done automatically when the PR is merged via GitHub Actions.

## Todo

- [ ] Json tree needs better spacing and buttons to collapse all / open all
- [ ] Spinners when processing a large amount of data
- [ ] SEO
- [ ] Make available offline as much as possible
- [ ] Temporarily store input in localStorage
- [ ] Better local development instructions since it requires wrangler which requires a cloudflare account.
- [ ] Remove mistakenly committed .idea folder
