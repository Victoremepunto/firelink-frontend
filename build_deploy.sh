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

# Build the Docker image
docker build -t "$IMAGE_NAME" .

# Tag the image for Quay
QUAY_IMAGE="quay.io/cloudservices/$IMAGE_NAME"
docker tag "$IMAGE_NAME" "$QUAY_IMAGE"

# Push the image to Quay
docker push "$QUAY_IMAGE"

echo "Image pushed to Quay: $QUAY_IMAGE"
