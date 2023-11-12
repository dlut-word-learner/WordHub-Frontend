FROM node:current-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install -g pnpm
RUN pnpm install
COPY ./ .
RUN pnpm build

FROM nginx:stable-alpine as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /app
COPY ./public/nginx.conf /etc/nginx/nginx.conf
