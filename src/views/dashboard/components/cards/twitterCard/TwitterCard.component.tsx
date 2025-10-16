import React, { useState, useEffect } from 'react';
import styles from './TwitterCard.module.scss';
import { Skeleton } from 'antd';
import Error from '@/components/error/Error.component';
import TwitterPost from './twitterPost/TwitterPost.component';
import { RSSFeedData, RSSFeedItem } from './TwitterCard.types';
import { IoLogoRss, IoLogoTwitter } from 'react-icons/io5';
import { BsTwitterX } from 'react-icons/bs';

interface TwitterCardProps {
  feedUrl?: string; // RSS feed URL to fetch posts from
  feedTitle?: string; // Display title for the feed
  maxPosts?: number; // Maximum number of posts to display
  useTwitterIcon?: boolean; // Whether to show Twitter icon instead of RSS icon
}

const TwitterCard = ({ feedUrl = 'https://rss.app/feeds/v1.1/_ce7ZbJOuBULzU6DG.json', feedTitle = 'RSS Feed', maxPosts = 3, useTwitterIcon = true }: TwitterCardProps) => {
  const [feedData, setFeedData] = useState<RSSFeedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parseJSONFeed = (jsonData: any): RSSFeedData => {
    // Helper function to extract text content from HTML
    const extractTextFromHTML = (htmlString: string): string => {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlString;
      return tempDiv.textContent || tempDiv.innerText || '';
    };

    console.log(jsonData);
    // Extract feed information
    const feed = {
      title: jsonData.title || feedTitle,
      description: jsonData.description || 'RSS Feed',
      link: jsonData.home_page_url || jsonData.feed_url || '',
      image: jsonData.icon || jsonData.image || undefined,
    };

    // Extract feed items
    const items = (jsonData.items || []).slice(0, maxPosts).map((item: any, index: number) => {
      const title = item.title || '';
      const rawDescription = item.content_html || item.content_text || item.summary || '';
      const description = extractTextFromHTML(rawDescription);
      const link = item.url || item.external_url || '';
      const pubDate = item.date_published || item.date_modified || new Date().toISOString();
      const guid = item.id || `item-${index}`;
      const author = item.authors?.[0]?.name || item.author?.name || '';

      // Look for media/images in various JSON feed formats
      let mediaUrl = '';
      if (item.image) {
        mediaUrl = item.image;
      } else if (item.attachments?.length > 0) {
        const imageAttachment = item.attachments.find((att: any) => att.mime_type?.startsWith('image/') || att.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i));
        if (imageAttachment) {
          mediaUrl = imageAttachment.url;
        }
      } else if (item._rss?.enclosure?.url) {
        mediaUrl = item._rss.enclosure.url;
      }

      return {
        id: guid,
        title,
        description,
        link,
        pubDate,
        author,
        guid,
        mediaUrl: mediaUrl || undefined,
      } as RSSFeedItem;
    });

    return { items, feed };
  };

  useEffect(() => {
    const fetchJSONFeed = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Direct fetch for JSON feeds (no CORS proxy needed for most JSON feeds)
        let response;
        try {
          response = await fetch(feedUrl);
        } catch (corsError) {
          // Fallback to CORS proxy if direct fetch fails
          const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
          response = await fetch(proxyUrl);

          if (!response.ok) {
            throw `HTTP error! status: ${response.status}`;
          }

          const proxyData = await response.json();
          const jsonData = JSON.parse(proxyData.contents);
          const rssData = parseJSONFeed(jsonData);
          setFeedData(rssData);
          return;
        }

        if (!response.ok) {
          throw `HTTP error! status: ${response.status}`;
        }

        const jsonData = await response.json();
        const rssData = parseJSONFeed(jsonData);
        setFeedData(rssData);
      } catch (err) {
        console.error('Error fetching JSON feed:', err);
        setError(typeof err === 'string' ? err : 'Failed to fetch JSON feed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJSONFeed();
  }, [feedUrl, maxPosts, feedTitle]);

  if (isLoading) return <Skeleton active />;
  if (error) return <Error error={error} />;

  const { items, feed } = feedData ?? { items: [], feed: null };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.accountInfo}>
          {useTwitterIcon ? <BsTwitterX className={styles.twitterIcon} /> : <IoLogoRss className={styles.rssIcon} />}
          <div className={styles.accountDetails}>
            <span className={styles.accountName}>{feed?.title || feedTitle}</span>
            <span className={styles.accountUsername}>{feed?.description || 'RSS Feed'}</span>
          </div>
        </div>
      </div>

      <div className={styles.postsContainer}>
        {items?.length > 0 ? (
          items?.map((item: any) => (
            <TwitterPost
              key={item.id || item.guid}
              post={{
                id: item.id || item.guid,
                text: item.title,
                content: item.description,
                author: {
                  name: feed?.title || feedTitle,
                  username: item.author || 'RSS',
                  profile_image_url: feed?.image,
                },
                created_at: item.pubDate,
                link: item.link,
                media: item.mediaUrl
                  ? [
                      {
                        type: 'photo' as const,
                        url: item.mediaUrl,
                        preview_image_url: item.mediaUrl,
                      },
                    ]
                  : undefined,
              }}
              compact={true}
            />
          ))
        ) : (
          <div className={styles.noPosts}>
            <p>No recent posts available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwitterCard;
