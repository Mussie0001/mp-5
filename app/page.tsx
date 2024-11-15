'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function Home() {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [message, setMessage] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted');


    const urlPattern = /^https:\/\/www\./;
    if (!urlPattern.test(url)) {
        setMessage('Please enter a valid URL');
        return;
    }

    const response = await fetch('/api/createAlias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alias, url }),
    });

    const result = await response.json();
    if (response.ok) {
        const baseUrl = window.location.origin;
        const generatedUrl = `${baseUrl}/${alias}`;
        setShortUrl(generatedUrl);
        setMessage('Short URL created!');
    } else {
        setMessage(result.error || 'Error creating alias');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      setMessage('Copied to clipboard!');
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        p: 3,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          URL Shortener
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Enter URL"
              variant="outlined"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Enter Alias"
              variant="outlined"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              required
            />
          </Box>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mb: 2 }}
          >
            Create Alias
          </Button>
        </form>
        {message && (
          <Typography
            variant="body1"
            color={message === 'Copied to clipboard!' ? 'secondary' : 'primary'}
            sx={{ mb: 2 }}
          >
            {message}
          </Typography>
        )}
        {shortUrl && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 2,
            }}
          >
            <Typography variant="body1" sx={{ mr: 1 }}>
              {shortUrl}
            </Typography>
            <IconButton
              color="primary"
              aria-label="copy to clipboard"
              onClick={copyToClipboard}
            >
              <ContentCopyIcon />
            </IconButton>
          </Box>
        )}
      </Paper>
    </Box>
  );
}


