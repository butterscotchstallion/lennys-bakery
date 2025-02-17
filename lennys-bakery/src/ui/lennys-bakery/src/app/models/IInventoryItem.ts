import { ITag } from "./ITag";

export interface IInventoryItem {
    id: number;
    slug: string;
    name: string;
    tags: ITag[];
    shortDescription: string;
    description: string;
    price: number;
    imageFilename: string;
    createdAt: Date;
    updatedAt: Date;
}
