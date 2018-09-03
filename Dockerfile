FROM node:latest

WORKDIR /usr/src/app

RUN wget https://github.com/BurnsCapital/etc-node-sync/archive/v0.0.1.tar.gz \
  && tar -zxvf v0.0.1.tar.gz \
  && cd etc-node-sync-0.0.1 \
  && npm i

CMD ["npm", "start"]

volume ./data:/usr/src/app/.conf
