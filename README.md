# reddit-lite-graphql

> wraps part of the reddit api in graphql

[![StackShare](https://img.shields.io/badge/tech-stack-0690fa.svg?style=flat)](https://stackshare.io/aretecode/reddit-lite)
[![Build Status](https://travis-ci.org/aretecode/reddit-lite-graphql.svg?branch=master)](https://travis-ci.org/aretecode/reddit-lite-graphql)

[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/aretecode/reddit-lite-graphql)

See [https://reddit-lite-graphql.now.sh/](https://reddit-lite-graphql.now.sh/) for the curren deployment

## Development

> if you are not familiar with graphql playground, [read about it here](https://www.apollographql.com/docs/apollo-server/features/graphql-playground)

```bash
git clone git@github.com:aretecode/reddit-lite-graphql.git

yarn install
yarn dev

open http://localhost:4000/graphql
```

## Example Query
```graphql
query {
  posts(subReddit: "vancouver", shouldMock: true) {
    list {
      id
      postKind
      createdAtIso
      createdAtUtc
      createdAtPretty
      title
      body
      url
      isSticky
      authorFullName
      authorFlairText
      commentCount
      score
      imageUrl
    }
  }
}
```
