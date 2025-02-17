import { ITag } from "./ITag";

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
}
