type Post = {
  id: number;
  caption: string;
  imageUrl?: string;
};

export interface IPostCreate {
  caption: string;
  imageUrl: string;
  userId: string
}
export type { Post };
