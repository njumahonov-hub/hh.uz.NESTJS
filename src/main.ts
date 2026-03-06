import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as express from "express";
import { HttpExceptionFilter } from "./common/filter/all-expextion.filters";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  //  swagger

  const config = new DocumentBuilder()
    .setTitle("Article project")
    .setDescription("article documantation")
    .setVersion("1.0.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        name: "JWT",
        bearerFormat: "JWT",
        description: "JWT token from header",
        in: "header",
      },
      "JWT-auth",
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // app.use("/uploads", express.static("uploads"))

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`server is running at: http://localhost:${PORT}`);
    console.log(`documantation link: http://localhost:${PORT}/api`);
  });
}
bootstrap();

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJuanVtYWhvbm92MUBnbWFpbC5jb20iLCJyb2xlcyI6InVzZXIiLCJpYXQiOjE3NzI3ODg2NTksImV4cCI6MTc3Nzk3MjY1OX0.bUYnjwC3ajXsCQHMolWU1iEB9nqYvaB7qysTPUYHezY

// ish izlovchi
// nodirbek1(user)


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJuanVtYWhvbm92QGdtYWlsLmNvbSIsInJvbGVzIjoidXNlciIsImlhdCI6MTc3Mjc5MTE0MCwiZXhwIjoxNzc3OTc1MTQwfQ.K3CLaGp9mGDvp_eFpGBvmb61bqdnwCmTFzexsN9tbr8

// ish beruvchi 
// nodirbek(admin,user)
