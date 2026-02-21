type Post = {
  id: number;
  _id?: string;
  userId?: string;
  caption: string;
  imageUrl?: string;
  likeCount?: number;
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

export type { Post };
