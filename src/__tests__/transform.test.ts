import { fixtureResponse } from '../fixture'
import { fromResponseToPostList } from '../transform'

describe('graphql', () => {
  describe('transform', () => {
    it('should safely transform our response', () => {
      const transformed = fromResponseToPostList(fixtureResponse as any)
      const [first] = transformed
      expect(first.id).toEqual('bjcurx')
      expect(typeof first.postKind).toEqual('string')
      expect(typeof first.title).toEqual('string')
      expect(typeof first.body).toEqual('string')
      expect(typeof first.url).toEqual('string')
      expect(typeof first.authorFullName).toEqual('string')
      expect(typeof first.authorFlairText).toEqual('string')
      expect(typeof first.score).toEqual('number')
      expect(typeof first.commentCount).toEqual('number')
      expect(typeof first.isSticky).toEqual('boolean')
      expect(transformed).toMatchSnapshot()
    })
  })
})
