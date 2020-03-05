FROM node:alpine as build
WORKDIR /app
COPY frontend/ .
RUN npm install && npm run-script build

FROM elixir:alpine
WORKDIR /app
COPY backend/ .
RUN yes | mix deps.get
RUN yes | mix release
RUN mkdir -p /var/www/tasm.io
COPY --from=build /app/build /var/www/tasm.io
CMD ["/app/_build/dev/rel/webserver/bin/webserver", "start"]
