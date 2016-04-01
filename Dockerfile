#FROM resin/beaglebone-node:0.12
FROM resin/beaglebone-node:4.3.2

# Use apt-get to install any dependencies
RUN apt-get update && apt-get install -yq \
    owfs \
    mosquitto \
    mosquitto-clients \
    dropbear \
    supervisor \
    cowsay && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install influxdb
RUN wget -O /tmp/influxdb_0.11.0-1_armhf.deb https://s3.amazonaws.com/influxdb/influxdb_0.11.0-1_armhf.deb && \
    dpkg -i /tmp/influxdb_0.11.0-1_armhf.deb && rm /tmp/influxdb_0.11.0-1_armhf.deb

# Change influxdb data to be stored in the persisting partition
RUN sed -i 's|/var/lib/influxdb|/data/influxdb|g' /etc/influxdb/influxdb.conf

# Create configuration for supervisord
RUN echo_supervisord_conf > /usr/local/etc/supervisord.conf && \
    echo "[include]" >> /usr/local/etc/supervisord.conf && \
    echo "files = /app/supervisor/*.conf" >> /usr/local/etc/supervisord.conf

# Our app will reside here
WORKDIR /app

RUN mkdir -p /mnt/1wire

# package.json is copied separately to enable better docker build caching
COPY package.json /app/package.json
RUN DEBIAN_FRONTEND=noninteractive JOBS=MAX npm install --unsafe-perm --loglevel error

# copy all files to /app
COPY . /app

# start the node code and suppress npm warnings with "-s"
CMD ["/app/start.sh"]
