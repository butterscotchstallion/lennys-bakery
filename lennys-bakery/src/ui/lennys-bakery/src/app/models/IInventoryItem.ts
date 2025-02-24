import { ITag } from "./ITag";
import { IInventoryItemImage } from "./IInventoryItemImage";

export interface IInventoryItem {
    id: number;
    slug: string;
    name: string;
    tags: ITag[];
    shortDescription: string;
    description: string;
    price: number;
    inventoryItemImages: IInventoryItemImage[];
    createdAt: Date;
    updatedAt: Date;
}
