# ---- Build Stage ----
FROM node:20 AS builder

WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY MindMate-FE/package*.json ./
RUN npm install

COPY MindMate-FE/ .
RUN npm run build

# ---- Serve Stage ----
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
