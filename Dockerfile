FROM node:16.8.0-alpine as builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install --no-progress --quiet
COPY . .
RUN npm run build

FROM node:16.8.0-alpine AS deps
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production-only

FROM node:16.8.0-alpine
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package.json .
COPY tsconfig.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist/ .
RUN chown node:node .
USER node

EXPOSE 3000
CMD ["npm", "start"]
