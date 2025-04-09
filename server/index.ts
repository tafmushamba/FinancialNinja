import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { setupAuth } from "./auth";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Setup authentication
const { isAuthenticated } = setupAuth(app);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app, isAuthenticated);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Try to serve the app on port 3000 first, then fall back to another port if needed
  const primaryPort = 3000;
  let port = primaryPort;
  
  const startServer = (portToUse: number) => {
    server.listen({
      port: portToUse,
      host: "0.0.0.0"
      // Removed reusePort option which was causing ENOTSUP error
    }, () => {
      log(`serving on port ${portToUse}`);
    }).on('error', (err: any) => {
      if (err.code === 'EADDRINUSE' && portToUse === primaryPort) {
        log(`Port ${portToUse} is in use, trying port ${primaryPort + 1}...`);
        startServer(primaryPort + 1);
      } else {
        log(`Error starting server: ${err.message}`);
        throw err;
      }
    });
  };
  
  startServer(port);
})();
