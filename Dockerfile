FROM node:24-alpine

WORKDIR /app

COPY . /app

RUN npm ci

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview"]