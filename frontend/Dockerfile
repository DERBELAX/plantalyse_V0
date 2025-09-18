# Étape de build
FROM node:18 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY package*.json ./
RUN npm install

COPY . .
ENV REACT_APP_BACKEND_URL=http://localhost:8085
RUN npm run build

# Étape de production (Nginx)
FROM nginx:alpine

# Copier les fichiers compilés dans nginx
COPY --from=build /app/build /usr/share/nginx/html

# Ajouter la configuration Nginx personnalisée
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Ouvrir le port 80
EXPOSE 80

# Lancer Nginx en mode "foreground"
CMD ["nginx", "-g", "daemon off;"]
