type Post = {
  id: number;
  caption: string;
  imageUrl?: string;
};

export interface IPostCreate {
  caption: string;
  imageUrl: string;
  user: string
}
export type { Post };
