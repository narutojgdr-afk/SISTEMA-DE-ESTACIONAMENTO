FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Copy node_modules from builder stage to avoid npm install issues in Alpine
# Note: This includes dev dependencies but is necessary due to npm ci failures in this environment
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main"]
