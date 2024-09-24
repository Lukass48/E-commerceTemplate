import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService], // Asegúrate de exportar el servicio
})
export class EmailModule {}
