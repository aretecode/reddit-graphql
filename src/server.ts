/**
 * @see https://www.apollographql.com/docs/react/features/pagination
 */
import { ApolloServer as FullApolloServer } from 'apollo-server'
import { ApolloServer as MicroApolloServer } from 'apollo-server-micro'
import gql from 'graphql-tag'
import { RESTDataSource } from 'apollo-datasource-rest'
import { InMemoryLRUCache as KeyValueCache } from 'apollo-server-caching'
import {
  RedditBasicResponseType,
  GetRedditPostsArgs,
  RedditLitePostsParamsType,
} from './typings'
import { fromResponseToPostList } from './transform'
import { fixtureLiteResponse } from './fixture'

/**
 * since we are deploying to now as serverless, we use Micro, but in dev, we listen to 4000
 */
const ApolloServer =
  process.env.NODE_ENV === 'development' ? FullApolloServer : MicroApolloServer

/**
 * @api @see https://www.reddit.com/dev/api/
 */
export class RedditAPI extends RESTDataSource {
  baseURL = 'https://www.reddit.com/r'

  async getPosts(args: GetRedditPostsArgs): Promise<RedditBasicResponseType> {
    const { subReddit, after, before, ...remaining } = args

    const path = `/${subReddit}.json`
    const params: RedditLitePostsParamsType = { ...remaining }
    if (after) {
      params.after = after
    }
    if (before) {
      params.before = before
    }

    return this.get(path, params as any)
  }
}

/**
 * could use `ID!`
 */
export const typeDefs = gql`
  type RedditLitePostItemType {
    id: String!
    postKind: String!
    createdAtIso: String!
    createdAtUtc: String!
    createdAtPretty: String!
    title: String!
    body: String!
    url: String!
    isSticky: Boolean!
    authorFullName: String!
    authorFlairText: String!
    commentCount: Int!
    score: Int!
    imageUrl: String!
  }

  type RedditLiteResponse {
    after: String
    before: String
    list: [RedditLitePostItemType]
  }
  type Query {
    posts(
      subReddit: String = "vancouver"
      before: String
      after: String
      limit: Int = 20
      shouldMock: Boolean
    ): RedditLiteResponse
  }
`

export const debugCache = new KeyValueCache()
export const server = new ApolloServer({
  cors: {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
  },
  introspection: true,
  playground: true,
  cache: debugCache,
  typeDefs,
  cacheControl: {
    defaultMaxAge: process.env.NODE_ENV === 'development' ? 1 : 60,
    stripFormattedExtensions: true,
  },
  resolvers: {
    Query: {
      posts: async (obj, args: GetRedditPostsArgs, context, info) => {
        const { subReddit, limit, before, after, shouldMock } = args

        if (shouldMock === true) {
          return fixtureLiteResponse
        }

        const api = context.dataSources.reddit as RedditAPI
        const response = await api.getPosts({ subReddit, limit, before, after })
        const posts = fromResponseToPostList(response as any)

        return {
          list: posts,
          limit,
          after: response.data.after || '',
          before: response.data.before || '',
        }
      },
    },
  },

  dataSources: () => {
    return {
      reddit: new RedditAPI(),
    }
  },
})

export default (process.env.NODE_ENV === 'development'
  ? (server as FullApolloServer).listen(4000)
  : (server as MicroApolloServer).createHandler())
