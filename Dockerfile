FROM node:20-alpine

RUN apk add --no-cache bash

WORKDIR /app

COPY package*.json ./
RUN npm install


COPY . .

ENV EXPO_DEVTOOLS_LISTEN_ADDRESS=0.0.0.0
ENV NODE_ENV=development

EXPOSE 8081 19000 19001 19002

# Tunnel = QR code qui marche pour tous les utilisateurs, sans config IP
# Sans --non-interactive pour afficher le QR dans le terminal
CMD ["npx", "expo", "start", "--tunnel"]
