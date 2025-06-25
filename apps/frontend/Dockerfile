# Use a small Node image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package manifests and install deps
COPY package*.json ./
RUN npm ci

# Copy the rest of your source
COPY . .

# Expose Vite dev server port
EXPOSE 3000

# Start Vite in host‐accessible mode
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]