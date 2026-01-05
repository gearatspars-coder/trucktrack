# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
# Use --force if there are dependency conflicts
RUN npm install --force
COPY . .

# Accept the API Key
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Build the app
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
# VITE usually builds to 'dist'. We check if it exists, otherwise use root.
COPY --from=build /app/dist /usr/share/nginx/html

# This ensures Nginx handles React routing correctly
RUN sed -i 's/index  index.html index.htm;/try_files $uri $uri\/ \/index.html;/g' /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
