export type StoreProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  image: string;
  alt: string;
  tag?: string;
  featured: boolean;
};

export type CartItem = {
  product: StoreProduct;
  quantity: number;
};
