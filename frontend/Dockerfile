FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

CMD [ "npm", "run", "build"]


FROM node:18-alpine AS host
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules/

EXPOSE 80

ENTRYPOINT [ "serve", "-s", "dist", "-l", "80"]