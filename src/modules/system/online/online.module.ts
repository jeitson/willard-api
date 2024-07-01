import { Module, forwardRef } from '@nestjs/common';

// import { AuthModule } from 'src/modules/auth/auth.module';

import { SseModule } from 'src/modules/sse/sse.module';

import { UserModule } from '../../user/user.module';

import { OnlineController } from './online.controller';
import { OnlineService } from './online.service';

const providers = [OnlineService];

@Module({
	imports: [UserModule, forwardRef(() => SseModule)],
	controllers: [OnlineController],
	providers,
	exports: [...providers],
})
export class OnlineModule {}
