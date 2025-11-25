# ---- Build Stage ----
FROM node:20 AS builder

WORKDIR /app

COPY MindMate-FE/package*.json ./
RUN npm install

COPY MindMate-FE/ .
# VITE_API_URL Jenkins me inject hoga
RUN npm run build

# ---- Serve Stage ----
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
