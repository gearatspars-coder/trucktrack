# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# -----------------------------------------------
# MAGIC PART: Accept the key during build
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
# -----------------------------------------------

RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Fix MIME types instantly
RUN sed -i '/location \/ {/a \    include /etc/nginx/mime.types;' /etc/nginx/conf.d/default.conf || true
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
