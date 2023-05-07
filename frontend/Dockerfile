# build stage
FROM node:18-alpine as build

WORKDIR /app

ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

# Copy dependency definitions
COPY package*.json ./

# Install production dependencies
RUN npm ci

# Copy app source code
COPY . .

ENV NODE_ENV=production

RUN npm run build

# release stage
FROM nginx:alpine-slim as release

# Replace Nginx config with our own
COPY nginx/*.conf /etc/nginx/conf.d/

# Copy site files
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
