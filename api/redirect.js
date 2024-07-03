const https = require("https");

const proxyRequest = (url, req, res) => {
  const options = new URL(url);
  options.headers = req.headers;
  const proxy = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });
  req.pipe(proxy, { end: true });
};

export default function handler(req, res) {
  const userAgent = req.headers["user-agent"].toLowerCase();
  const isMobile = /android|iphone/.test(userAgent);

  if (isMobile) {
    proxyRequest("https://regalium-mobile.vercel.app" + req.url, req, res);
  } else {
    proxyRequest("https://regalium-desktop.vercel.app" + req.url, req, res);
  }
}
