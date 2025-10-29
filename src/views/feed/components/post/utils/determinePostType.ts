import { Post } from '@/types/ISocialPost';

export type PostCardType = 'text-only' | 'text-with-media' | 'media-only' | 'shared';

export const determinePostType = (post: Post): PostCardType => {
  const hasBody = post.body && post.body.trim().length > 0;
  const hasMedia = post.media && post.media.length > 0;

  if (!hasBody && hasMedia) {
    return 'media-only';
  }

  if (hasBody && hasMedia) {
    return 'text-with-media';
  }

  if (hasBody && !hasMedia) {
    return 'text-only';
  }

  // Default fallback
  return 'text-only';
};
