# Use Node.js LTS with Alpine for small image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY frontend_vue/package*.json ./
RUN npm install

# Copy the rest of the application
COPY frontend_vue .

# Expose Vite dev server port
EXPOSE 5173

# Set environment variable for Vite to be accessible from outside
ENV HOST=0.0.0.0

# Start Vite dev server
CMD ["npm", "run", "dev", "--", "--host"]