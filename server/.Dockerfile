FROM node:18-alpine
WORKDIR /app
COPY package* .
RUN npm install
COPY . .
CMD ["node", "index.js"]
