# Multi-stage build für React/Vite
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY Frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY Frontend/ .

# Build the application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
