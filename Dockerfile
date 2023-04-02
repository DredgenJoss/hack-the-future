FROM node:lts-alpine as production

ARG APP_ENV=prod
ENV APP_ENV=${APP_ENV}
ENV NODE_ENV=production

EXPOSE 3000

WORKDIR /usr/src/app

COPY package*.json ./

COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
