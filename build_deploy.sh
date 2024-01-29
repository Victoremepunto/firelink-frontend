#!/bin/bash

# Change directory to where your Dockerfile is, if necessary
# cd /path/to/your/dockerfile

# Get the first 7 characters of the latest Git commit hash
GIT_COMMIT_HASH=$(git rev-parse --short=7 HEAD)

if [ -z "$GIT_COMMIT_HASH" ]; then
    echo "Git commit hash not found."
    exit 1
fi

# Define your image name
IMAGE_NAME="firelink-frontend:$GIT_COMMIT_HASH"

DOCKER_CONF="$PWD/.docker"
mkdir -p "$DOCKER_CONF"

docker --config="$DOCKER_CONF" login -u="$QUAY_USER" -p="$QUAY_TOKEN" quay.io
docker --config="$DOCKER_CONF" login -u="$RH_REGISTRY_USER" -p="$RH_REGISTRY_TOKEN" registry.redhat.io

# Build the Docker image
docker --config="$DOCKER_CONF" build -t "$IMAGE_NAME" .

# Tag the image for Quay
QUAY_IMAGE="quay.io/cloudservices/$IMAGE_NAME"
docker --config="$DOCKER_CONF" tag "$IMAGE_NAME" "$QUAY_IMAGE"

# Push the image to Quay
docker --config="$DOCKER_CONF" push "$QUAY_IMAGE"

echo "Image pushed to Quay: $QUAY_IMAGE"
