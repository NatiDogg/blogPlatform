import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from 'prisma/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TagsService } from 'src/tags/tags.service';
import { CreateArticleDto } from './dtos/createArticleDto';
import { QueryArticleDto } from './dtos/queryArticleDto';
import { UpdateArticleDto } from './dtos/updateArticleDto';
import { CACHE_MANAGER,Cache } from '@nestjs/cache-manager';

@Injectable()
export class ArticleService {
    private articleListCacheKeys:Set<string> = new Set()
  constructor(
    private prisma: PrismaService,
    private readonly tagsService: TagsService,
    @Inject(CACHE_MANAGER) private cacheManager:Cache
  ) {}

  private generateArticleListCacheKeys = (name: string)=>{
         
        return `Article_Cache_key_${name}`
  }

  // Helper method to look up Author record by userId
  private async getAuthorByUserId(userId: string) {
    const author = await this.prisma.author.findUnique({
      where: { userId },
    });

    if (!author) {
      throw new ForbiddenException(
        'Author profile not found for this user. Ensure the user is promoted to an author.',
      );
    }

    return author;
  }

  async createArticle(articleDetails: CreateArticleDto, userId: string) {
    const author = await this.getAuthorByUserId(userId);

    const { tags,title,description, ...restArticleDetails } = articleDetails;

    const existingArticle = await this.prisma.article.findFirst({
       where:{
            authorId: author.id,
            title: title,
            description: description,
            deletedAt: null
       }
    })
    if(existingArticle){
      throw new ConflictException('An article with this exact title and description already exists')
    }

    let tagConnections: { id: string }[] = [];

    if (tags && tags.length > 0) {
      const tagsResult = await this.tagsService.createTags({ tags });
      tagConnections = tagsResult.tags.map((tag) => ({ id: tag.id }));
    }

    try {
      const newlyCreatedArticle = await this.prisma.article.create({
        data: {
            title,
            description,
          ...restArticleDetails,
          authorId: author.id, 
          tags:
            tagConnections.length > 0
              ? { connect: tagConnections }
              : undefined,
        },
        include: {
          author: { include: { user: { omit: { password: true } } } },
          tags: true,
          category: true,
        },
      });

      return {
        success: true,
        message: 'Article Created Successfully',
        article: newlyCreatedArticle,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new BadRequestException('Category not found');
      }
      throw error;
    }
  }

  async getArticles(query: QueryArticleDto) {
    const { title, category, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const titleCondition = title
      ? { title: { contains: title, mode: 'insensitive' as const } }
      : {};

    const categoryCondition = category
      ? {
          category: {
            name: {
              equals: category,
              mode: 'insensitive' as const,
            },
          },
        }
      : {};

      const cacheKey = this.generateArticleListCacheKeys('GetArticles')

      this.articleListCacheKeys.add(cacheKey)
      const cachedArticles = await this.cacheManager.get(cacheKey)

      if(cachedArticles){
        console.log('Cache Hit --- and returning articles from cache')
          return {
           success: true,
           message: 'Articles Retrieved Successfully',
           articles: cachedArticles
          };
      }
        console.log('Cache Miss --- and returning articles from db')

    const articles = await this.prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
        ...titleCondition,
        ...categoryCondition,
      },
      include: {
        author: { include: { user: { omit: { password: true } } } },
        category: true,
        comments: true,
        tags: true,
      },
      orderBy: { [sortBy]: sortOrder },
    });

    await this.cacheManager.set(cacheKey, articles,60000)

    return {
      success: true,
      message: 'Articles Retrieved Successfully',
      articles: articles,
    };
  }

  async getArticle(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id, deletedAt: null, status: 'PUBLISHED' },
      include: {
        author: { include: { user: { omit: { password: true } } } },
        category: true,
        comments: true,
        tags: true,
      },
    });

    if (!article) {
      throw new NotFoundException('Article Not Found');
    }

    return {
      success: true,
      message: 'Article Retrieved Successfully',
      article: article,
    };
  }

  async getMyArticles(userId: string) {
    const author = await this.getAuthorByUserId(userId);

    const articles = await this.prisma.article.findMany({
      where: {
        authorId: author.id,
        deletedAt: null,
      },
      include: {
        category: true,
        tags: true,
        comments: true
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      message: 'Articles Retrieved Successfully',
      articles: articles,
    };
  }

  async getMyArticle(articleId: string, userId: string) {
    const author = await this.getAuthorByUserId(userId);

    const article = await this.prisma.article.findFirst({
      where: {
        id: articleId,
        authorId: author.id,
        deletedAt: null,
      },
      include: {
        category: true,
        tags: true,
      },
    });

    if (!article) {
      throw new NotFoundException('Article Not Found');
    }

    return {
      success: true,
      message: 'Article Retrieved Successfully',
      article: article,
    };
  }

  async updateArticle(
    articleId: string,
    updateDetails: UpdateArticleDto,
    userId: string,
  ) {
    const author = await this.getAuthorByUserId(userId);

    const { tags, ...restUpdateDetails } = updateDetails;
    let tagConnections: { id: string }[] | undefined = undefined;

    if (tags) {
      const tagsResult = await this.tagsService.createTags({ tags });
      tagConnections = tagsResult.tags.map((tag) => ({ id: tag.id }));
    }

    try {
      const updatedArticle = await this.prisma.article.update({
        where: {
          id: articleId,
          authorId: author.id,
          deletedAt: null,
        },
        data: {
          ...restUpdateDetails,
          tags: tagConnections ? { set: tagConnections } : undefined,
        },
        include: {
          category: true,
          tags: true,
        },
      });

      return {
        success: true,
        message: 'Article Updated Successfully',
        article: updatedArticle,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            'Article not found or you do not have permission to update it.',
          );
        }
      }
      throw error;
    }
  }

  async publishArticle(articleId: string, userId: string) {
    const author = await this.getAuthorByUserId(userId);

    try {
      const publishedArticle = await this.prisma.article.update({
        where: {
          id: articleId,
          authorId: author.id,
          status: 'DRAFT',
          deletedAt: null,
        },
        data: {
          status: 'PUBLISHED',
          publishedAt: new Date(),
        },
      });

      return {
        success: true,
        message: 'Article Published Successfully',
        article: publishedArticle,
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            'Article not found, already published, or you do not have permission to publish it.',
          );
        }
      }
      throw error;
    }
  }

  async deleteArticle(
    articleId: string,
    user: { id: string; role: Role },
  ) {
    try {
      let whereCondition: Prisma.ArticleWhereInput = {
        id: articleId,
        deletedAt: null,
      };

      if (user.role === Role.AUTHOR) {
        const author = await this.getAuthorByUserId(user.id);
        whereCondition.authorId = author.id;
      }

      await this.prisma.article.updateMany({
        where: whereCondition,
        data: {
          deletedAt: new Date(),
        },
      });

      return {
        success: true,
        message: 'Article Deleted Successfully',
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(
            'Article not found, already deleted, or you do not have permission to delete it.',
          );
        }
      }
      throw error;
    }
  }
}