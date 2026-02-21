type Post = {
  id: number;
  _id?: string;
  userId?: string;
  caption: string;
  imageUrl?: string;
  likeCount?: number;
  commentsCount?: number;
};

export interface IPostCreate {
  caption: string;
  imageUrl: string;
  userId: string;
}

export interface IPostUpdate {
  caption?: string;
  imageUrl?: string;
}

export interface PostQuery {
  userId?: string;
}

export type { Post };
