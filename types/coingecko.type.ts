export interface SparklineData {
  price: number[];
}

interface ROI {
  times: number;
  currency: string;
  percentage: number;
}

export interface CoingeckoCoinData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: ROI | null;
  last_updated: string;
  sparkline_in_7d: SparklineData;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_1y_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_30d_in_currency: number;
  price_change_percentage_7d_in_currency: number;
}

export type CoingeckoHistoryResponse = [number, number, number, number][];

export interface CoingeckoSingleCoinData {
  id: string;
  symbol: string;
  name: string;
  asset_platform_id: string;
  platforms: Record<string, string>;
  detail_platforms: Record<string, { decimal_place: number; contract_address: string }>;
  block_time_in_minutes: number;
  hashing_algorithm: string | null;
  categories: string[];
  preview_listing: boolean;
  public_notice: string | null;
  additional_notices: string[];
  description: Record<string, string>;
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    bitcointalk_thread_identifier: string | null;
    telegram_channel_identifier: string;
    subreddit_url: string | null;
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  country_origin: string;
  genesis_date: string | null;
  contract_address: string;
  sentiment_votes_up_percentage: number | null;
  sentiment_votes_down_percentage: number | null;
  watchlist_portfolio_users: number;
  market_cap_rank: number | null;
  coingecko_rank: number;
  coingecko_score: number;
  developer_score: number;
  community_score: number;
  liquidity_score: number;
  public_interest_score: number;
  community_data: {
    facebook_likes: number | null;
    twitter_followers: number;
    reddit_average_posts_48h: number;
    reddit_average_comments_48h: number;
    reddit_subscribers: number;
    reddit_accounts_active_48h: number;
    telegram_channel_user_count: number;
  };
  market_data: MarketData;
  developer_data: {
    forks: number;
    stars: number;
    subscribers: number;
    total_issues: number;
    closed_issues: number;
    pull_requests_merged: number;
    pull_request_contributors: number;
    code_additions_deletions_4_weeks: {
      additions: number | null;
      deletions: number | null;
    };
    commit_count_4_weeks: number;
    last_4_weeks_commit_activity_series: number[];
  };
  public_interest_stats: {
    alexa_rank: number | null;
    bing_matches: number | null;
  };
  status_updates: string[];
  last_updated: string;
  tickers: Ticker[];
}
export interface Ticker {
  base: string;
  target: string;
  market: {
    name: string;
    identifier: string;
    has_trading_incentive: boolean;
  };
  last: number;
  volume: number;
  converted_last: {
    btc: number;
    eth: number;
    usd: number;
  };
  converted_volume: {
    btc: number;
    eth: number;
    usd: number;
  };
  trust_score: string | null;
  bid_ask_spread_percentage: number;
  timestamp: string;
  last_traded_at: string;
  last_fetch_at: string;
  is_anomaly: boolean;
  is_stale: boolean;
  trade_url: string;
  token_info_url: string | null;
  coin_id: string;
  target_coin_id: string;
}
interface MarketData {
  ath: Record<string, number>;
  ath_change_percentage: Record<string, number>;
  ath_date: Record<string, string>;
  atl: Record<string, number>;
  atl_change_percentage: Record<string, number>;
  atl_date: Record<string, string>;
  circulating_supply: number;
  current_price: Record<string, number>;
  fdv_to_tvl_ratio: null;
  fully_diluted_valuation: Record<string, number>;
  high_24h: Record<string, number>;
  last_updated: string;
  low_24h: Record<string, number>;
  market_cap: Record<string, number>;
  market_cap_change_24h: number;
  market_cap_change_24h_in_currency: Record<string, number>;
  market_cap_change_percentage_24h: number;
  market_cap_change_percentage_24h_in_currency: Record<string, number>;
  market_cap_fdv_ratio: number;
  market_cap_rank: number;
  max_supply: number;
  mcap_to_tvl_ratio: null;
  price_change_24h: number;
  price_change_24h_in_currency: Record<string, number>;
  price_change_percentage_1h_in_currency: Record<string, number>;
  price_change_percentage_1y: number;
  price_change_percentage_1y_in_currency: Record<string, number>;
  price_change_percentage_7d: number;
  price_change_percentage_7d_in_currency: Record<string, number>;
  price_change_percentage_14d: number;
  price_change_percentage_14d_in_currency: Record<string, number>;
  price_change_percentage_24h: number;
  price_change_percentage_24h_in_currency: Record<string, number>;
  price_change_percentage_30d: number;
  price_change_percentage_30d_in_currency: Record<string, number>;
  price_change_percentage_60d: number;
  price_change_percentage_60d_in_currency: Record<string, number>;
  price_change_percentage_200d: number;
  price_change_percentage_200d_in_currency: Record<string, number>;
  roi: null;
  total_supply: number;
  total_value_locked: null;
  total_volume: Record<string, number>;
}
