FROM node:16

LABEL maintainer="brett@dudo.io"

WORKDIR /usr/src/app

ENV PATH ./node_modules/.bin:$PATH

# install and cache app dependencies
ADD package*.json ./
RUN if test -f "./package-lock.json"; then npm ci --silent --production; fi

ADD . ./

EXPOSE 8080

# start app
ENTRYPOINT [ "npm" ]
CMD [ "start" ]
