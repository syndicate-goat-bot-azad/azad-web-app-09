# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy rest of the app
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Launch the optimized main launcher
# Set max memory to 512MB (adjust if needed)
CMD ["node", "--max-old-space-size=512", "main.js"]
