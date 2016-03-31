#FROM resin/beaglebone-node:0.12
FROM resin/beaglebone-node:4.3.2

# Use apt-get to install any dependencies
RUN apt-get update && apt-get install -yq \
    owfs \
    mosquitto \
    mosquitto_clients \   # for testing only
    dropbear \
    supervisor \
    cowsay && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY etc/* /etc/

COPY supervisor/* /etc/supervisor/conf.d/

RUN mkdir -p /mnt/1wire

# package.json is copied separately to enable better docker build caching
COPY package.json /usr/src/app/package.json
RUN DEBIAN_FRONTEND=noninteractive JOBS=MAX npm install --unsafe-perm --loglevel error

COPY . /usr/src/app
# start the node code and suppress npm warnings with "-s"
CMD [ "npm", "start", "-s" ]
