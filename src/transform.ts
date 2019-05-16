import { distanceInWords, format } from 'date-fns'
import {
  RedditBasicResponseType,
  RedditLitePostItemType,
  RedditLitePostKindType,
} from './typings'

export function fromResponseToPostList(response: RedditBasicResponseType) {
  return response.data.children.map(
    (child): RedditLitePostItemType => {
      const { data } = child

      /**
       * could separate these to their own lines
       */
      return {
        id: data.id,
        postKind: (data.post_hint || 'text') as RedditLitePostKindType,
        title: data.title || '',
        body: data.selftext || '',
        url: 'https://reddit.com' + data.permalink,
        isSticky: !!data.stickied,

        // .downs, .ups
        score: data.score || 0,

        // could nest
        authorFullName: data.author_fullname || '',
        authorFlairText: data.author_flair_text || '',
        commentCount: data.num_comments || 0,

        /**
         * we could also add another for hover
         */
        createdAtUtc: data.created_utc,
        createdAtIso: format(
          data.created_utc * 1000,
          'YYYY-MM-DD[T]HH:mm:ssZZ'
        ),
        createdAtPretty: distanceInWords(data.created_utc * 1000, Date.now()),

        imageUrl: data.thumbnail === 'self' ? '' : data.thumbnail,
      }
    }
  )
}
