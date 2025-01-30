FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

CMD [ "npm", "run", "build"]


FROM node:18-alpine AS host
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules/

EXPOSE 5173

ENTRYPOINT [ "npm", "run", "preview"]