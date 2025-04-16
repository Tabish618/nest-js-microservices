import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {

  const httpApp = await NestFactory.create(UserModule);
    
    // Start the HTTP server (for external API access)
    await httpApp.listen(parseInt(process.env.USER_PORT || '3002'), () => {
      console.log('HTTP server running on http://localhost:3000');
    });
  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UserModule, {
      transport: Transport.TCP,
      options: {
        host: process.env.USER_HOST || '0.0.0.0',
        port: parseInt(process.env.USER_PORT || '3002'),
      },
    });
  
    await app.listen();
    console.log(`User microservice is running on port ${process.env.USER_PORT}`);
}
bootstrap();
