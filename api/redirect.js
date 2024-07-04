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
    // Example of form submission handling logic
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      // Here you can handle the form data, e.g., save it or process it
      console.log("Received form data:", body);

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
    });
  } else {
    // Proxy the request to the appropriate site
    if (isMobile) {
      proxyRequest("https://regalium-mobile.vercel.app" + req.url, req, res);
    } else {
      proxyRequest("https://regalium-desktop.vercel.app" + req.url, req, res);
    }
  }
}
