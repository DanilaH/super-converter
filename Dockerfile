# syntax=docker/dockerfile:1

FROM node:22.13.0-bookworm-slim AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.10.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html
COPY deploy/vps/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
