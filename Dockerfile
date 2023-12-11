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

# Stage 2: Serve the app using Nginx on Fedora
FROM registry.access.redhat.com/ubi8/ubi:8.9-1028

# Install Nginx
RUN dnf -y update && \
    dnf -y install nginx && \
    dnf clean all

# Create a non-root user
RUN useradd -m appuser

# Change ownership of necessary directories
RUN chown -R appuser:appuser /usr/share/nginx /var/log/nginx /var/lib/nginx /run

# Copy built static files from the build stage
COPY --from=react-build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration file
COPY config/nginx.conf /etc/nginx/nginx.conf

# Switch to non-root user
USER appuser

# Expose port 8080 for Nginx
EXPOSE 8000

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
