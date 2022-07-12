## Setup

```
$ yarn install
```

## Build

Build for staging:

```
$ yarn build
```

Build for production:

```
$ yarn build-prod
```

When deploying to a server with a path prefix, use the environment variable `PUBLIC_URL`. Example:

```
$ PUBLIC_URL=/mtm yarn build
```

## Development

```
$ REACT_APP_BACKEND_URL=http://localhost:8080 yarn start
```

To specify a feedback email different to default

## Feedback

There are environment variables to send feedback email rom contact page and to upload file.
The environment variables are configured in .env file.

If you use elastic email, the from address must to be the username email in elastic email.

REACT_APP_FEEDBACK_EMAIL_FROM
REACT_APP_FEEDBACK_EMAIL_TO
REACT_APP_FEEDBACK_EMAIL_SECURE_TOKEN

Notes:

-   Create a file `.env.local` (copy it from `.env`) to customize environment variables so you can simply run `yarn start`.

## Tests

```
$ yarn test
```

Run integration tests locally:

```
$ yarn cy:open # interactive UI
$ yarn cy:run # non-interactive UI
```
