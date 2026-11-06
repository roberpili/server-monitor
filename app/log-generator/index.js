import winston from "winston";
import express from "express";
import _ from "lodash";

// Configure Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""}`;
        }),
      ),
    }),
    new winston.transports.File({ filename: "logs/combined.log", maxsize: 5242880, maxFiles: 5 }),
    new winston.transports.File({ filename: "logs/error.log", level: "error", maxsize: 5242880, maxFiles: 5 }),
  ],
});

// Sample log messages by level
const messages = {
  info: [
    "User login successful",
    "User logout",
    "Database query executed",
    "API request received",
    "Cache miss - fetching from database",
    "Background job completed",
    "File upload processed",
    "Email notification sent",
    "Rate limit check passed",
    "Session renewed",
    "Health check passed",
    "Payment processed successfully",
    "Order created",
    "Profile updated",
    "Password changed",
    "Two-factor authentication enabled",
    "API key generated",
    "Webhook delivered",
    "Scheduled task executed",
    "Data export completed",
  ],
  warn: [
    "High memory usage detected",
    "Slow query detected",
    "Rate limit approaching",
    "Deprecated API endpoint used",
    "Retry attempt for failed operation",
    "Disk usage above 80%",
    "Connection pool near capacity",
    "Cache hit ratio below threshold",
    "Long-running request detected",
    "Queue depth increasing",
    "SSL certificate expires in 30 days",
    "Unusual traffic pattern detected",
    "Feature flag evaluation failed, using default",
    "Configuration reload skipped - no changes",
    "Third-party service latency elevated",
  ],
  error: [
    "Database connection timeout",
    "Failed to process payment",
    "Authentication failed",
    "External API unreachable",
    "Disk space low",
    "Memory allocation failed",
    "Request validation error",
    "Service unavailable",
    "Deadlock detected in database",
    "Message queue connection lost",
    "SSL handshake failed",
    "Invalid JWT token",
    "Rate limit exceeded",
    "File upload size exceeded",
    "Duplicate key constraint violation",
    "Circuit breaker opened",
    "Migration failed - rollback initiated",
    "Backup job failed",
    "Email delivery failed",
    "Webhook delivery failed after retries",
  ],
  debug: [
    "Entering function processPayment",
    "SQL query: SELECT * FROM users WHERE id = ?",
    "Cache key: user:123:profile",
    "HTTP request headers parsed",
    "JWT payload decoded",
    "Redis GET operation",
    "Database connection acquired from pool",
    "Event published to message queue",
    "Feature flag 'new-checkout' evaluated: true",
    "Rate limit check: 45/100 requests",
    "Session data deserialized",
    "Middleware chain: auth -> rateLimit -> validate",
    "Background worker picking up job",
    "Retry attempt 2 of 3 for email service",
    "Configuration loaded from environment",
  ],
};

const logLevels = _.keys(messages);

// Generation state
let generationTimer = null;
let isGenerating = false;

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());

// Endpoint to manually trigger a single log entry
app.post("/logs", (req, res) => {
  const { level = "info", message = "Manual log entry", meta = {} } = req.body;
  logger.log(level, message, meta);
  res.json({ success: true, message: "Log entry created", level, message });
});

// GET /status - Returns server status and generation state
app.get("/status", (req, res) => {
  res.json({
    status: "running",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    logGeneration: isGenerating ? "active" : "stopped",
    availableLevels: logLevels,
    messageCounts: _.mapValues(messages, (msgs) => msgs.length),
  });
});

// POST /start-generation - Start continuous log generation
app.post("/start-generation", (req, res) => {
  if (isGenerating) {
    return res.json({
      success: false,
      message: "Log generation is already running",
    });
  }

  const { intervalMin = 1000, intervalMax = 10000 } = req.body;

  function generateLog() {
    const level = _.sample(logLevels);
    const message = _.sample(messages[level]);
    const meta = {
      requestId: `req-${Date.now()}-${_.random(100000, 999999)}`,
      userId: `user-${_.random(1, 10000)}`,
      timestamp: new Date().toISOString(),
    };

    if (level === "error") meta.errorCode = `ERR-${_.random(1000)}`;
    if (level === "warn") meta.warningCode = `WRN-${_.random(100)}`;
    if (level === "debug") meta.debugInfo = `DBG-${_.random(10000)}`;

    logger.log(level, message, meta);
  }

  function scheduleNextLog() {
    generationTimer = setTimeout(() => {
      generateLog();
      if (isGenerating) {
        scheduleNextLog();
      }
    }, _.random(intervalMin, intervalMax));
  }

  isGenerating = true;
  scheduleNextLog();
  logger.info("Random log generator started");

  res.json({
    success: true,
    message: "Log generation started",
    interval: `${intervalMin}-${intervalMax}ms`,
  });
});

// POST /stop-generation - Stop continuous log generation
app.post("/stop-generation", (req, res) => {
  if (!isGenerating) {
    return res.json({
      success: false,
      message: "Log generation is not running",
    });
  }

  isGenerating = false;
  if (generationTimer) {
    clearTimeout(generationTimer);
    generationTimer = null;
  }
  logger.info("Random log generator stopped");

  res.json({
    success: true,
    message: "Log generation stopped",
  });
});

// POST /generate - Generate a batch of logs immediately (one-time)
app.post("/generate", (req, res) => {
  const { level, count = 1 } = req.body;
  const levels = level ? [level] : logLevels;

  for (let i = 0; i < count; i++) {
    const randomLevel = _.sample(levels);
    const message = _.sample(messages[randomLevel]);
    const meta = {
      requestId: `req-${Date.now()}-${_.random(100000, 999999)}`,
      userId: `user-${_.random(1, 10000)}`,
      timestamp: new Date().toISOString(),
      triggeredBy: "manual-generation",
    };

    if (randomLevel === "error") meta.errorCode = `ERR-${_.random(1000)}`;
    if (randomLevel === "warn") meta.warningCode = `WRN-${_.random(100)}`;
    if (randomLevel === "debug") meta.debugInfo = `DBG-${_.random(10000)}`;

    logger.log(randomLevel, message, meta);
  }

  res.json({
    success: true,
    message: `Generated ${count} log entr${count > 1 ? "ies" : "y"}`,
    levelsUsed: levels,
  });
});

// Endpoint to get current log stats
app.get("/logs/stats", (req, res) => {
  res.json({
    status: "running",
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

app.listen(PORT, () => {
  logger.info(`Log generator server running on port ${PORT}`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`POST /logs - Create a single manual log entry`);
  console.log(`POST /generate - Generate a batch of logs immediately`);
  console.log(`POST /start-generation - Start continuous log generation`);
  console.log(`POST /stop-generation - Stop continuous log generation`);
  console.log(`GET /status - Get server status`);
  console.log(`GET /logs/stats - Get server stats`);
});

export default app;