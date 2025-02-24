import { ITag } from "./ITag";
import { IInventoryItemImage } from "./IInventoryItemImage";

export interface IProduct {
    id: number;
    name: string;
    price: number;
    tags: ITag[];
    imageFilename: string;
    description: string;
    shortDescription: string;
    slug: string;
    numReviews: number;
    rapidShipAvailable: boolean;
    inventoryItemImages: IInventoryItemImage[];
}
