import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTagDto } from './dtos/createTagDto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTags(tagDto: CreateTagDto) {
    // 1. Normalize and deduplicate tags in memory
    const normalizedTags = Array.from(
      new Set(tagDto.tags.map((tag) => tag.trim().toLowerCase())),
    );

    if (normalizedTags.length === 0) {
      return { success: true, message: 'No tags to process', tags: [] };
    }

    // 2. Insert all new tags in a single batch
    await this.prisma.tag.createMany({
      data: normalizedTags.map((name) => ({ name })),
      skipDuplicates: true,
    });

    // 3. Retrieve and return the tags
    const tags = await this.prisma.tag.findMany({
      where: { name: { in: normalizedTags } },
    });

    return {
      success: true,
      message: 'Tags created successfully',
      tags,
    };
  }

  async getTags() {
    const tags = await this.prisma.tag.findMany();

    return {
      success: true,
      message: 'Tags retrieved successfully',
      tags,
    };
  }
}