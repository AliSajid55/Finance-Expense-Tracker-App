FROM node:20-alpine
WORKDIR /app
COPY package.json .
COPY tsconfig.json .
COPY .env.local .
COPY .env.example .
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]
