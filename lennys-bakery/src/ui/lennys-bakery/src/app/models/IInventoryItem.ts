export interface IInventoryItem {
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  imageFilename: string;
  createdAt: Date;
  updatedAt: Date;
}
