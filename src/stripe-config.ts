export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const products: Product[] = [
  {
    id: 'prod_SvtugjIZRhQszv',
    priceId: 'price_1S026DGbujDcxhXqpyUYHP4b',
    name: 'Démarche administrative',
    description: 'Service de démarche administrative pour vos besoins',
    mode: 'payment'
  }
];

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductByPriceId = (priceId: string): Product | undefined => {
  return products.find(product => product.priceId === priceId);
};