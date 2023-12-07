# Stage 1: Build the React application
FROM node:latest as react-build

# Set the working directory for the React app
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) for React app
COPY your-react-app/package*.json ./

# Install React app dependencies
RUN npm install

# Copy the React app source code
COPY your-react-app/ ./

# Build the React app
RUN npm run build

# Stage 2: Serve the app using Nginx on Fedora
FROM fedora:latest

# Install Nginx
RUN dnf -y update && \
    dnf -y install nginx && \
    dnf clean all

# Create a non-root user
RUN useradd -m appuser

# Change ownership of necessary directories
RUN chown -R appuser:appuser /usr/share/nginx /var/log/nginx /var/lib/nginx /run

# Switch to non-root user
USER appuser

# Copy built static files from the build stage
COPY --from=react-build /app/build /usr/share/nginx/html

# Change Nginx configuration to listen on port 8080
RUN sed -i 's/listen\(.*\)80;/listen 8080;/' /etc/nginx/nginx.conf

# Expose port 8080 for Nginx
EXPOSE 8080

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
