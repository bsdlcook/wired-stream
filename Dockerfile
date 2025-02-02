FROM node:8-alpine

# App directory.
WORKDIR /app

# Copy source code to directory.
COPY . .

# Install babel-cli globally to the system.
RUN npm install babel-cli -g

# Install necessary dependencies.
RUN npm install

# Expose port 3000.
EXPOSE 3000

# Run application with babel.
CMD ["babel-node","app"]
