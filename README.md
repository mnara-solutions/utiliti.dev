# Utiliti

A collection of open source utilities hosted online at [utiliti.dev](https://utiliti.dev).

## Standards

- A set of fast and well-designed utilities.
- All compute will be done in-browser so that no data is sent back to us.
- If data needs to be sent to us (private notes), it will be end-to-end encrypted.
- No tracking.

## Tech Stack

- Built on top of [React Router](https://reactrouter.com/)
- Styled with [Tailwind](https://tailwindcss.com/)
- Hosted on [Cloudflare Pages](https://pages.cloudflare.com/) + Functions

Running a framework like React Router on Cloudflare Pages means that we utilize edge functions to deliver a server side rendered initial page. This increases the cost of hosting a project like this, but our users get a performance benefit and more importantly it unlocks more powerful utilities like private notes.

## Roadmap

There are lots of ideas for future utilities, some of which can be seen on our [roadmap](https://github.com/orgs/mnara-solutions/projects/1/views/1).

If you see a useful utility, leave a comment and tell us more about how you would use it.

Similarly, if you have a request, create an issue and describe the feature.

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

- [ ] Spinners when processing a large amount of data
- [ ] Temporarily store input in localStorage
