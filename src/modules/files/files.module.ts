import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FirebaseModule } from 'src/core/shared/firebase/firebase.module';
import { UsersModule } from '../users/users.module';
import { FileSizeValidationPipe } from 'src/core/common/pipes/file-size-validation.pipe';

@Module({
  controllers: [FilesController],
  providers: [FileSizeValidationPipe],
  imports: [FirebaseModule, UsersModule]
})
export class FilesModule {}
