const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');

// Helper to fetch with redirect follow
function fetchStream(url, res, depth = 0) {
  if (depth > 6) {
    return res.status(502).json({ error: 'Too many redirects from upstream' });
  }

  const client = url.startsWith('https') ? https : http;
  const req = client.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': '*/*'
    }
  }, (upstreamRes) => {
    // Follow 301, 302, 303, 307, 308 redirects
    if (upstreamRes.statusCode >= 300 && upstreamRes.statusCode < 400 && upstreamRes.headers.location) {
      let redirectUrl = upstreamRes.headers.location;
      if (!redirectUrl.startsWith('http')) {
        const u = new URL(url);
        redirectUrl = `${u.protocol}//${u.host}${redirectUrl}`;
      }
      return fetchStream(redirectUrl, res, depth + 1);
    }

    if (upstreamRes.statusCode !== 200 && upstreamRes.statusCode !== 206) {
      return res.status(upstreamRes.statusCode || 500).json({
        error: `Upstream returned status ${upstreamRes.statusCode}`
      });
    }

    // Set audio headers
    res.setHeader('Content-Type', upstreamRes.headers['content-type'] || 'audio/mpeg');
    if (upstreamRes.headers['content-length']) {
      res.setHeader('Content-Length', upstreamRes.headers['content-length']);
    }
    if (upstreamRes.headers['accept-ranges']) {
      res.setHeader('Accept-Ranges', upstreamRes.headers['accept-ranges']);
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400');

    upstreamRes.pipe(res);
  });

  req.on('error', (err) => {
    console.error('Audio proxy error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to stream audio' });
    }
  });
}

// @route   GET /api/proxy-audio
// @desc    Stream audio from Google Drive or external URL bypassing CORS/anti-hotlinking
// @access  Public
router.get('/', (req, res) => {
  const { id, url } = req.query;

  let targetUrl = '';
  if (id) {
    targetUrl = `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`;
  } else if (url) {
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      targetUrl = `https://drive.usercontent.google.com/download?id=${driveMatch[1]}&export=download&confirm=t`;
    } else {
      targetUrl = url;
    }
  } else {
    return res.status(400).json({ error: 'Missing file id or url parameter' });
  }

  fetchStream(targetUrl, res);
});

module.exports = router;
