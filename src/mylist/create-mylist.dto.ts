import { ContentType } from './mylist.enum';

export class CreateMyListDto {
  readonly userId: string;
  readonly contentId: string;
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
