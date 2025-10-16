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

const TwitterCard = ({ feedUrl = 'https://rss.app/embed/v1/list/t1BZDo5ufDDD481P', feedTitle = 'RSS Feed', maxPosts = 3, useTwitterIcon = true }: TwitterCardProps) => {
  const [feedData, setFeedData] = useState<RSSFeedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const parseRSSFeed = (xmlText: string): RSSFeedData => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw 'Failed to parse RSS feed';
    }

    // Extract feed information
    const channel = xmlDoc.querySelector('channel');
    const imageUrl = channel?.querySelector('image url')?.textContent || channel?.querySelector('image')?.querySelector('url')?.textContent;
    const feed = {
      title: channel?.querySelector('title')?.textContent || feedTitle,
      description: channel?.querySelector('description')?.textContent || 'RSS Feed',
      link: channel?.querySelector('link')?.textContent || '',
      image: imageUrl || undefined,
    };

    // Extract feed items
    const items = Array.from(xmlDoc.querySelectorAll('item'))
      .slice(0, maxPosts)
      .map((item, index) => {
        const title = item.querySelector('title')?.textContent || '';
        const description = item.querySelector('description')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString();
        const guid = item.querySelector('guid')?.textContent || `item-${index}`;
        const author = item.querySelector('author')?.textContent || item.querySelector('dc\\:creator')?.textContent || '';

        return {
          id: guid,
          title,
          description,
          link,
          pubDate,
          author,
          guid,
        } as RSSFeedItem;
      });

    return { items, feed };
  };

  useEffect(() => {
    const fetchRSSFeed = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use a CORS proxy to fetch the RSS feed
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`;
        const response = await fetch(proxyUrl);

        if (!response.ok) {
          throw `HTTP error! status: ${response.status}`;
        }

        const data = await response.json();
        const rssData = parseRSSFeed(data.contents);
        setFeedData(rssData);
      } catch (err) {
        console.error('Error fetching RSS feed:', err);
        setError(typeof err === 'string' ? err : 'Failed to fetch RSS feed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRSSFeed();
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
