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

## Tests

```
$ yarn test
```

Run integration tests locally:

```
$ yarn cy:open # interactive UI
$ yarn cy:run # non-interactive UI
```
