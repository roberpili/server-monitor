import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';

@Controller('log-scaner')
export class LogScanerController {
  @ApiBody({ type: Array<Record<string, any>> })
  @Post('ingest/:jobId')
  ingestLog(
    @Param('jobId') jobId: string,
    @Body() body: Array<Record<string, any>>,
  ) {
    console.log(body);
  }
}
