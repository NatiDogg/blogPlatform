import {PartialType} from '@nestjs/mapped-types'
import { CreateArticleDto } from './createArticleDto'

export class UpdateArticleDto extends PartialType(CreateArticleDto){}