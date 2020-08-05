#### builder image
FROM node:12.16.2 as builder
LABEL stage=builder

ARG node_memory=8192
WORKDIR /calypso
ENV YARN_CACHE_FOLDER=/calypso/.yarn-cache
ENV NVM_DIR=/calypso/.nvm
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=$node_memory
ENV HOME="/calypso"

RUN git clone https://github.com/nvm-sh/nvm.git "$NVM_DIR" \
	&& git -C "$NVM_DIR" checkout v0.35.3

COPY . ./src

# We run `nvm.sh` outside ./src so it doesn't try to use node version specified in `.nvmrc` before installing it.
RUN . "$NVM_DIR/nvm.sh" \
	&& cd ./src \
	&& nvm install \
	&& nvm use \
	&& yarn

ENTRYPOINT [ "/bin/bash" ]

#### ci image
FROM node:12.16.2 as ci
LABEL stage=ci

ARG node_memory=8192
ARG UID=1003
WORKDIR /calypso
ENV YARN_CACHE_FOLDER=/calypso/.yarn-cache
ENV NVM_DIR=/calypso/.nvm
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=$node_memory
ENV DETECT_CHROMEDRIVER_VERSION=false
ENV CHROMEDRIVER_FILEPATH="/usr/local/bin/chromedriver"
ENV HOME="/calypso"

RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add \
&&  echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list \
&&  apt-get update \
&&  apt-get install -y \
    xvfb \
    google-chrome-stable \
    fonts-ipafont-gothic \
    xfonts-100dpi \
    xfonts-75dpi \
    xfonts-scalable \
    xfonts-cyrillic \
    fonts-wqy-zenhei \
&&  sed -i 's|HERE/chrome"|HERE/chrome" --disable-setuid-sandbox --no-sandbox --disable-dev-shm-usage|g' "/opt/google/chrome/google-chrome" \
&&  rm -rf /var/lib/apt/lists/*

RUN CHROMEDRIVER_RELEASE="$(google-chrome --version | sed 's/^Google Chrome \([0-9]*\)\..*$/\1/')" \
&&  CHROMEDRIVER_VERSION=$(curl --silent --show-error --location --fail --retry 4 --retry-delay 5 http://chromedriver.storage.googleapis.com/LATEST_RELEASE_${CHROMEDRIVER_RELEASE}) \
&&  curl --silent --show-error --location --fail --retry 4 --retry-delay 5 --output chromedriver_linux64.zip "http://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip" \
&&  mkdir -p tmp/chromedriver \
&&  cd tmp/chromedriver \
&&  unzip ../../chromedriver_linux64.zip \
&&  mv chromedriver /usr/local/bin/chromedriver \
&&  chmod +x /usr/local/bin/chromedriver \
&&  cd ../.. \
&&  rm -rf chromedriver_linux64.zip tmp/chromedriver

RUN chown $UID /calypso
COPY --from=builder --chown=$UID /calypso/.yarn-cache /calypso/.yarn-cache
COPY --from=builder --chown=$UID /calypso/.nvm /calypso/.nvm
