# Base image
FROM node:19

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml (if using pnpm) to the working directory
COPY package.json ./

# Install pnpm globally and install dependencies
RUN yarn install

# Copy the remaining project files to the working directory
COPY . .

# Build the React project
# RUN pnpm run build

# Expose the port the app will run on
EXPOSE 3000

# Install serve to serve the built app and start the server
# RUN npm install -g serve
# CMD ["serve", "-s", "build", "-l", "3000"]

CMD ["yarn", "start"]