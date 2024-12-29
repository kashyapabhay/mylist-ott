import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ContentType } from './mylist.enum';


export class CreateMyListDto {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly contentId: string;

  @IsEnum(ContentType)
  @IsNotEmpty()
  readonly contentType: ContentType;

  constructor(userId: string, contentId: string, contentType: ContentType) {
    this.userId = userId;
    this.contentId = contentId;
    this.contentType = contentType;
  }

  getUserId(): string {
    return this.userId;
  }

  getContentId(): string {
    return this.contentId;
  }

  getContentType(): ContentType {
    return this.contentType;
  }
}
