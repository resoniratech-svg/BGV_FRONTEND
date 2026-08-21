# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Disable strict engine matching during Docker build
ENV NPM_CONFIG_ENGINE_STRICT=false

# Accept build argument for API URL
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./

# Install dependencies without strict engine enforcement
RUN npm install --engine-strict=false

COPY . .

# Build production bundle
RUN npm run build


# Production stage
FROM caddy:alpine

# Copy built static assets from dist folder
COPY --from=build /app/dist /usr/share/caddy

EXPOSE 80

# Serve static files with Caddy
CMD ["caddy", "file-server", "--root", "/usr/share/caddy", "--listen", ":80"]