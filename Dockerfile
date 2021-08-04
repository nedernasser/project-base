FROM node:14.17-alpine as builder
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install --no-progress --quiet
COPY . .
RUN npm run build

FROM node:14.17-alpine
ENV TZ=America/Sao_Paulo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
ENV NODE_ENV=production
WORKDIR /usr/src/app
RUN chown node:node .
USER node
COPY package*.json ./
RUN npm install --production-only
COPY --from=builder /usr/src/app/dist/ .
EXPOSE 3000
CMD ["npm", "start"]
