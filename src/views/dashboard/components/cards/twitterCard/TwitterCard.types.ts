export interface RSSFeedItem {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  author?: string;
  content?: string;
  guid?: string;
}

export interface RSSFeedData {
  items: RSSFeedItem[];
  feed: {
    title: string;
    description: string;
    link: string;
    image?: string;
    lastBuildDate?: string;
  };
}

// Keep Twitter types for backward compatibility if needed
export interface TwitterPost {
  id: string;
  text: string;
  author: {
    name: string;
    username: string;
    profile_image_url?: string;
  };
  created_at: string;
  public_metrics?: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
  };
  media?: Array<{
    type: 'photo' | 'video' | 'animated_gif';
    url: string;
    preview_image_url?: string;
  }>;
  referenced_tweets?: Array<{
    type: 'retweeted' | 'quoted' | 'replied_to';
    id: string;
  }>;
}

export interface TwitterCardData {
  posts: TwitterPost[];
  account: {
    name: string;
    username: string;
    profile_image_url?: string;
  };
}
