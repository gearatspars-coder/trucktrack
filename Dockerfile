# Stage 1: Build the app
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy the build output to the Nginx folder
COPY --from=build /app/dist /usr/share/nginx/html
# Copy a default config if you have one, or we will inject it later
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
