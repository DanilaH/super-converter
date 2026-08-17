# syntax=docker/dockerfile:1

FROM node:22.13.0-bookworm-slim AS builder
WORKDIR /app
RUN npm install --global pnpm@11.10.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine AS runtime
RUN rm -rf /usr/share/nginx/html
COPY --from=builder /app/dist /usr/share/nginx/html
COPY deploy/vps/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
