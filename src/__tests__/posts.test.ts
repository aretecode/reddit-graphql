/**
 * @see https://www.apollographql.com/docs/apollo-server/features/testing.html
 */
import 'reflect-metadata'
import gql from 'graphql-tag'
import { createTestClient } from 'apollo-server-testing'
import { server } from '../server'

const GET_POSTS = gql`
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
`

describe('Reddit Posts', () => {
  it('can read', async () => {
    const { query } = createTestClient(server)
    const result = await query({
      query: GET_POSTS,
    })

    expect(result.errors).toBeFalsy()
    expect(result.data.posts.list.length).toBeGreaterThan(0)
    expect(result).toMatchSnapshot()
  })
})
