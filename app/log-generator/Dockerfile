# Node.js App Dockerfile
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (no lockfile, so use npm install)
RUN npm install --omit=dev

# Copy application code
COPY index.js ./

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "index.js"]