# Use the official Node.js 20 image as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Install a simple HTTP server to serve static files
RUN npm install -g serve

# Serve the React application from the 'build' directory
CMD ["serve", "-s", "dist"]

# Expose port 3000
EXPOSE 3000
