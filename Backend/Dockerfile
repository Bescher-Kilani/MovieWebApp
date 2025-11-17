# Multi-stage build für Spring Boot Backend

# Build Stage
FROM maven:3.9.11-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy Maven files first for better caching
COPY Backend/pom.xml .
COPY Backend/.mvn .mvn
COPY Backend/mvnw .
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY Backend/src ./src

# Build application
RUN ./mvnw clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]