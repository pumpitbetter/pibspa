import express from "express";
import pkg from "@react-router/node";
const { createRequestHandler } = pkg;
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5174; // SSR server port

// Serve static assets from the build directory
app.use(express.static(path.join(__dirname, "build/ssr/client")));

let handler;

try {
  // Dynamic import of the SSR build
  const build = await import("./build/ssr/index.js");
  
  // React Router request handler
  handler = createRequestHandler({
    build: build,
  });
  
  console.log("✅ SSR build loaded successfully");
} catch (error) {
  console.error("❌ Failed to load SSR build:", error.message);
  
  // Fallback handler for when build fails
  handler = (req, res) => {
    res.status(500).send(`
      <html>
        <body>
          <h1>SSR Build Error</h1>
          <p>The SSR build failed to load. Check the console for errors.</p>
          <p>Error: ${error.message}</p>
          <p>Try running <code>npm run build:ssr</code> manually to see detailed errors.</p>
        </body>
      </html>
    `);
  };
}

// All other requests are handled by React Router
app.all("*", handler);

app.listen(port, () => {
  console.log(`✅ SSR server listening at http://localhost:${port}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, "build/ssr/client")}`);
});
