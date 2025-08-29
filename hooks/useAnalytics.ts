import { useState, useEffect } from 'react';

interface AnalyticsData {
  totalVisitors: number;
  totalPageViews: number;
  averageSessionDuration: string;
  bounceRate: string;
  mostVisitedMovies: Array<{
    movieTitle: string;
    movieId: string;
    visits: number;
  }>;
  popularGenres: Array<{
    genre: string;
    count: number;
    percentage: number;
  }>;
  dailyVisitors: Array<{
    date: string;
    visitors: number;
  }>;
}

// Mock data - in production, this would fetch from Vercel Analytics API
const mockAnalyticsData: AnalyticsData = {
  totalVisitors: 12450,
  totalPageViews: 28340,
  averageSessionDuration: '3m 45s',
  bounceRate: '32%',
  mostVisitedMovies: [
    { movieTitle: 'Avatar: The Way of Water', movieId: '76600', visits: 1240 },
    { movieTitle: 'Black Panther: Wakanda Forever', movieId: '505642', visits: 980 },
    { movieTitle: 'Top Gun: Maverick', movieId: '361743', visits: 875 },
    { movieTitle: 'The Batman', movieId: '414906', visits: 720 },
    { movieTitle: 'Doctor Strange 2', movieId: '453395', visits: 650 }
  ],
  popularGenres: [
    { genre: 'Action', count: 3200, percentage: 28 },
    { genre: 'Drama', count: 2800, percentage: 24 },
    { genre: 'Comedy', count: 2100, percentage: 18 },
    { genre: 'Thriller', count: 1800, percentage: 16 },
    { genre: 'Sci-Fi', count: 1600, percentage: 14 }
  ],
  dailyVisitors: [
    { date: '2024-01-01', visitors: 420 },
    { date: '2024-01-02', visitors: 380 },
    { date: '2024-01-03', visitors: 520 },
    { date: '2024-01-04', visitors: 450 },
    { date: '2024-01-05', visitors: 680 },
    { date: '2024-01-06', visitors: 720 },
    { date: '2024-01-07', visitors: 580 }
  ]
};

export const useAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In production, this would be:
        // const response = await fetch('/api/analytics');
        // const data = await response.json();
        
        setData(mockAnalyticsData);
      } catch (err) {
        setError('Failed to fetch analytics data');
        console.error('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return { data, loading, error };
};
