import { Injectable, NotFoundException } from '@nestjs/common';
import { Report } from './reports.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dto/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private readonly repo: Repository<Report>,
  ) {}

  async create(reportDto: CreateReportDto, user: User): Promise<Report> {
    const report: Report = this.repo.create(reportDto);
    report.user = user;
    return await this.repo.save(report);
  }

  async changeApproval(id: number, approved: boolean): Promise<Report> {
    const foundReport = await this.repo.findOneBy({ id });
    if (!foundReport) throw new NotFoundException(`No report with id:${id}`);
    foundReport.approved = approved;
    return await this.repo.save(foundReport);
  }

  createEstimate(query: GetEstimateDto) {
    const {make , model , lng,lat ,year ,mileage} = query
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)' ,'price')
      .where('make = :make', { make })
      .andWhere('model= :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)' , 'DESC')
      .setParameters({mileage})
      .limit(3)
      .getRawOne();
  }
}
