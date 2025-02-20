FROM node:18-alpine AS build

ARG VITE_BACKEND_DOMAIN
ENV VITE_BACKEND_DOMAIN=${VITE_BACKEND_DOMAIN}
ARG VITE_BACKEND_PORT
ENV VITE_BACKEND_PORT=${VITE_BACKEND_PORT}
WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

RUN  npm run build




FROM node:18-alpine AS host
WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 80

ENTRYPOINT [ "serve", "-s", "dist", "-l", "80"]