FROM node:16.6
ENV NODE_ENV=production
WORKDIR /application
EXPOSE 25565
COPY package*.json ./
COPY . .
# RUN npm install --production
CMD ["node", "."]