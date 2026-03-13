# Estágio de Build
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copiar apenas a pasta server para o contexto do build
COPY server/pom.xml .
COPY server/src ./src

# Compilar
RUN mvn clean package -DskipTests

# Estágio de Execução
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
