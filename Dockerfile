# Stage 1: Build the React application
FROM registry.access.redhat.com/ubi8/nodejs-18:1-81 as react-build

USER 0

# Set the working directory for the React app
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) for React app
COPY package*.json ./

# Install React app dependencies
RUN npm install

# Copy the React app source code
COPY . ./

# Build the React app
RUN npm run build

# Stage 2: Serve the app
FROM quay.io/cloudservices/caddy-ubi:ec1577c

ENV CADDY_TLS_MODE http_port 8000

COPY ./config/Caddyfile /opt/app-root/src/Caddyfile

COPY --from=react-build /app/build /opt/app-root/src/build

COPY ./package.json /opt/app-root/src

WORKDIR /opt/app-root/src

EXPOSE 8000

CMD ["caddy", "run", "--config", "/opt/app-root/src/Caddyfile"]
