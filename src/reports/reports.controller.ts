import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Param,
  Patch,
  Query,
  Get
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { AuthGuard } from '../guards/auth.gaurd';
import { CurrentUser } from '../users/decorators/currentUser.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReportDto } from './dto/report.dto';
import { ApproveReportDto } from './dto/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dto/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(body, user);
  }

  @UseGuards(AdminGuard)
  @Patch('/:id')
  approveReports(
    @Param('id') id: string,
    @Body() approveStatus: ApproveReportDto,
  ) {
    return this.reportsService.changeApproval(
      parseInt(id),
      approveStatus.approved,
    );
  }

  @Get('/get-estimate')
  getEstimateDto(@Query() query : GetEstimateDto){
     return this.reportsService.createEstimate(query);
  }
}
