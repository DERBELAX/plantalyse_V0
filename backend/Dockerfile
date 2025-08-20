FROM eclipse-temurin:21-jdk

WORKDIR /app

# Copier tout le projet Maven dans le conteneur
COPY . .

# Télécharger les dépendances et compiler le projet
RUN ./mvnw clean package -DskipTests

# Copier le JAR généré dans une image finale plus propre
FROM eclipse-temurin:21-jdk
WORKDIR /app
COPY --from=0 /app/target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
