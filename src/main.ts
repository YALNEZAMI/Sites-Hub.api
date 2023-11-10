import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cors from 'cors';

async function bootstrap() {
  dotenv.config(); // Load environment variables from the .env file

  const app = await NestFactory.create(AppModule);
  app.use(
    cors({
      origin: process.env.UI_URI, // Adjust the origin to match your Angular app's URL
      credentials: false, // Include credentials if necessary
    }),
  );
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
