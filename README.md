# Utiliti

A collection of open source utilities hosted online at [utiliti.dev](https://utiliti.dev).

Our promise:
 - A set of fast and well-designed utilities.
 - No data will be sent back to us, except for private notes.
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
 - [ ] Add JSON "prettier" output
 - [ ] Simple editor with line numbers for encode & decoder IO
 - [ ] Prevent private note from ever posting plaintext to backend if javascript is not enabled
 - [ ] Error pages (404 / 500)
 - [ ] Favicon + icon
 - [ ] Tooltip for icon buttons + copy confirmation
 - [ ] Better local development instructions since it requires wrangler which requires a cloudflare account.
 - [ ] Remove mistakenly committed .idea folder
 - [ ] Add a GitHub action to enforce prettier
 - [ ] Add a GitHub action to enforce linting
 - [ ] Make available offline as much as possible
