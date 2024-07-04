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

  if (req.method === "POST" && req.url === "/submit") {
    // Handle form submission logic here, for example saving the data or sending it to a backend
    // ...

    // After handling the form submission, redirect to the appropriate home.html
    if (isMobile) {
      res.writeHead(302, {
        Location: "https://regalium-mobile.vercel.app/home.html",
      });
    } else {
      res.writeHead(302, {
        Location: "https://regalium-desktop.vercel.app/home.html",
      });
    }
    res.end();
  } else {
    // Proxy the request to the appropriate site
    if (isMobile) {
      proxyRequest("https://regalium-mobile.vercel.app" + req.url, req, res);
    } else {
      proxyRequest("https://regalium-desktop.vercel.app" + req.url, req, res);
    }
  }
}
