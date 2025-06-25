import Parser from 'rss-parser';
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
  AppBar,
  Toolbar,
} from '@mui/material';

type FeedItem = {
  title: string;
  link: string;
  pubDate: string;
  contentSnippet: string;
  enclosure?: {
    url: string;
  };
  mediaContentUrl?: string;
  contentEncoded?: string;
  imageUrl?: string;
};

function extractImageUrl(item: any): string | undefined {
  // 1. enclosure.url
  if (item.enclosure?.url) return item.enclosure.url;
  // 2. media:content
  if (item['media:content']?.url) return item['media:content'].url;
  // 3. media:thumbnail (dizi veya obje olabilir)
  const thumbnail = item['media:thumbnail'];
  if (Array.isArray(thumbnail) && thumbnail.length > 0 && thumbnail[0].url) return thumbnail[0].url;
  if (thumbnail?.url) return thumbnail.url;
  // 4. content:encoded içindeki ilk <img src="...">
  if (item['content:encoded']) {
    const match = item['content:encoded'].match(/<img[^>]+src=["']([^"'>]+)["']/i);
    if (match) return match[1];
  }
  return undefined;
}

async function getFeed(feedUrl: string): Promise<FeedItem[]> {
  const parser = new Parser<any>();
  try {
    const feed = await parser.parseURL(feedUrl);
    return feed.items.map(item => {
      const imageUrl = extractImageUrl(item);
      return {
        title: item.title || 'No Title',
        link: item.link || '#',
        pubDate: item.pubDate || new Date().toISOString(),
        contentSnippet: item.contentSnippet?.split('\n')[0] || 'No snippet available.',
        enclosure: item.enclosure,
        mediaContentUrl: item['media:content']?.url,
        contentEncoded: item['content:encoded'],
        imageUrl,
      };
    });
  } catch (error) {
    console.error('Error fetching the news feed:', error);
    return [];
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

function truncate(str: string, n: number) {
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}

export default async function Home() {
  const feedUrl = 'https://www.wired.com/feed/tag/ai/latest/rss';
  const newsItems = await getFeed(feedUrl);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'grey.100', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar sx={{ paddingY: 2 }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary">
              Wired: AI News
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              The latest stories on Artificial Intelligence from Wired
            </Typography>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {newsItems.length > 0 ? (
            newsItems.map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.03)',
                      boxShadow: 8,
                    },
                  }}
                >
                  <CardActionArea
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'stretch' }}
                  >
                    {item.imageUrl && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.imageUrl}
                        alt={item.title}
                        sx={{
                          width: '100%',
                          objectFit: 'cover',
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                        }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1, width: '100%' }}>
                      <Typography gutterBottom variant="h6" component="div" fontWeight="bold" sx={{ minHeight: 56 }}>
                        {truncate(item.title, 80)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {formatDate(item.pubDate)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {truncate(item.contentSnippet, 120)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid size={12}>
              <Box textAlign="center" py={10}>
                <Typography variant="h5" color="text.secondary">Could not load news feed.</Typography>
                <Typography color="text.secondary">Please try again later.</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>

      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 4, mt: 4, borderTop: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            &copy; {new Date().getFullYear()} - AI News from Wired. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
