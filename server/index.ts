import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes, setupWebSocket } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { createServer } from "http";
import { AddressInfo } from "net";

function log(message: string) {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [express] ${message}`);
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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
  const server = createServer(app);
  setupWebSocket(server);
  registerRoutes(app);

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

  // Get port from environment or use default with retry logic
  const PORT = parseInt(process.env.PORT || '5000');
  const MAX_RETRIES = 5;
  let currentTry = 0;
  let currentPort = PORT;

  const attemptListen = () => {
    try {
      log(`Attempting to start server on port ${currentPort}...`);
      const listener = server.listen(currentPort, "0.0.0.0")
        .on('listening', () => {
          const address = listener.address() as AddressInfo;
          const actualPort = address.port;
          log(`Server started successfully on port ${actualPort}`);
          process.env.MAIN_APP_PORT = actualPort.toString();
          if (app.get("env") === "development") {
            log("Running in development mode");
          }
        })
        .on('error', (error: any) => {
          if (error.code === 'EADDRINUSE') {
            currentTry++;
            if (currentTry < MAX_RETRIES) {
              currentPort++;
              log(`Port ${currentPort-1} in use, trying port ${currentPort}`);
              attemptListen();
            } else {
              log(`Could not find an available port after ${MAX_RETRIES} retries`);
              process.exit(1);
            }
          } else {
            log(`Unexpected error: ${error.message}`);
            throw error;
          }
        });
    } catch (error: any) {
      log(`Failed to start server: ${error.message}`);
      process.exit(1);
    }
  };

  process.on('unhandledRejection', (reason, promise) => {
    log(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  });

  attemptListen();
})();
