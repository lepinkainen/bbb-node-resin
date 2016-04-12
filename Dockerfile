FROM resin/beaglebone-node:4.3.2

# Tellstick support
RUN echo "deb http://download.telldus.com/debian/ stable main" >> /etc/apt/sources.list
RUN apt-key adv --fetch-keys http://download.telldus.se/debian/telldus-public.key

# Use apt-get to install any dependencies
RUN apt-get update && apt-get install -yq \
    owfs \
    ow-shell \
    python \
    mosquitto \
    mosquitto-clients \
    openssh-server \
    dropbear \
    supervisor \
    telldus-core \
    libftdi1 \
    cowsay && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Install influxdb
ADD https://s3.amazonaws.com/influxdb/influxdb_0.11.0-1_armhf.deb /tmp/influxdb_0.11.0-1_armhf.deb
RUN dpkg -i /tmp/influxdb_0.11.0-1_armhf.deb && rm /tmp/influxdb_0.11.0-1_armhf.deb

# Change influxdb data to be stored in the persisting partition
RUN sed -i 's|/var/lib/influxdb|/data/influxdb|g' /etc/influxdb/influxdb.conf



#ADD http://download.telldus.se/TellStick/Software/telldus-core/telldus-core-2.1.1.tar.gz /tmp/telldus-core-2.1.1.tar.gz
#WORKDIR /tmp/
#RUN tar zxf /tmp/telldus-core-2.1.1.tar.gz
#WORKDIR /tmp/telldus-core-2.1.1
#RUN cmake . && make && make install

# Configuration for supervisord
COPY supervisord.conf /usr/local/etc/supervisord.conf

# Our app will reside here
WORKDIR /app

# For owfs
RUN mkdir -p /mnt/1wire

# package.json is copied separately to enable better docker build caching
COPY package.json /app/package.json
# Install node dependencies from package.json
RUN DEBIAN_FRONTEND=noninteractive JOBS=MAX npm install --unsafe-perm --loglevel error

# copy all files to /app
COPY . /app

# start the app
CMD ["/app/start.sh"]
