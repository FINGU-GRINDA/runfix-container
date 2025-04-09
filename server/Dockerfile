FROM oven/bun:slim AS base
RUN apt-get update && apt-get install -y curl wget

FROM base AS build
WORKDIR /app
# Cache packages installation
COPY . .
RUN bun install
ENV NODE_ENV=production


FROM build AS production
WORKDIR /app
RUN bun run generate
RUN bunx prisma migrate deploy
ENV NODE_ENV=production
CMD ["bun", "run", "start"]
EXPOSE 8000