# Base image
FROM node:16.10.0

ENV NODE_OPTIONS=--max_old_space_size=4096

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml (if using pnpm) to the working directory
 COPY package.json package-lock.json ./

# Install pnpm globally and install dependencies
RUN npm install

# Copy the remaining project files to the working directory
COPY . .

# Build the React project
RUN npm run build

# Expose the port the app will run on
EXPOSE 3000

# Install serve to serve the built app and start the server
# RUN npm install -g serve
# CMD ["serve", "-s", "build", "-l", "3000"]

CMD ["npm", "run", "server"]