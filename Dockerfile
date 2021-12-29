
FROM node:alpine



# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
#COPY package*.json ./
# If you are building your code for production
# RUN npm ci --only=production 
RUN rm -rf /tmp/node_modules
ADD package.json /tmp/package.json
#ADD package-lock.json /tmp/package-lock.json
RUN cd /tmp && npm i --force
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app/
# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

EXPOSE 3000
CMD ["npm", "run", "start"] 
