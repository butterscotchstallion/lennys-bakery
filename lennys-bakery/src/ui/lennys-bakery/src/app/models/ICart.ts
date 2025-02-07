import { IInventoryItem } from './IInventoryItem';
import { IUser } from './IUser';

export interface ICart {
  id: number;
  quantity: number;
  inventoryItem: IInventoryItem;
  user: IUser;
}
