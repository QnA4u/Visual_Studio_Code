#!/bin/bash

OPENSSL_VERSION="1.1.1g"

OPENSSL_DIR="$(pwd)/vendor/openssl"
if [ -d $OPENSSL_DIR ]
then
	echo "Skipping, vendor/openssl already exists"
	exit 0
fi

cd vendor

# Download from openssl
curl -O "https://www.openssl.org/source/openssl-$OPENSSL_VERSION.tar.gz"

# Unpack
tar -xf "openssl-$OPENSSL_VERSION.tar.gz" && mv "openssl-$OPENSSL_VERSION" openssl
rm "openssl-$OPENSSL_VERSION.tar.gz"

# Build
cd openssl
TEMP_SYSTEM=$SYSTEM
unset SYSTEM

if [[ $AS == *"arm-linux-gnueabihf"* ]]; then
  ./Configure linux-generic32
elif [[ $AS == *"aarch64-linux-gnu"* ]]; then
  ./Configure linux-aarch64
else
  ./config
fi

make
SYSTEM=$TEMP_SYSTEM