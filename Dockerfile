FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

ENV HOSTNAME="0.0.0.0"
CMD ["npm", "start"]
