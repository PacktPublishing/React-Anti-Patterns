export type RemoteMenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  ingredients: string[];
  description?: string;
  allergyTags?: string[];
  calories?: number;
};

