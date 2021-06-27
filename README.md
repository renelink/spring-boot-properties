# Spring Boot Properties

The spring-boot-properties is a spring-boot plugin that can be placed on the classpath of a spring boot web application. It comes with it's own UI that is implemented with React and Bootstrap.

## Access the UI

After you added the spring-boot-properties-***.jar to the classpath of your spring boot web application, youo can access the spring application properties through the URL:

     <yourhostname>/<yourContextPath>/spring/index.html

usually

    http://localhost:8080/spring/index.html

## Purpose of this Project

This project is an example of how to create a spring boot web application plugin that comes with it's own React UI and is build using maven.

### Build the project

    mvn install

### npm watch

Execute in `src/main/frontend` folder

    npm run watch:build

