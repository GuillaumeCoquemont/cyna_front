FROM node:20.18.2-alpine AS builder

WORKDIR /app
COPY package*.json ./
#RUN npm install --force
# Installer les dépendances
RUN npm ci --legacy-peer-deps
COPY . .

# Variables d'environnement pour le build
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build
# Etape de production
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]