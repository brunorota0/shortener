import { SetMetadata } from '@nestjs/common';

export const ResponseType = (type: any) => SetMetadata('Type', type);
