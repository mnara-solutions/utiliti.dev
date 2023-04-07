FROM node:16-alpine
WORKDIR /app
COPY ./package.json ./
RUN npm ci
COPY ./ .
RUN npm run build
ENV NODE_ENV=production
CMD ["npm", "run" ,"node:start"]