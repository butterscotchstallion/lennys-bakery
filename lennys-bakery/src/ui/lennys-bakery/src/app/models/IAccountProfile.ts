import { IUser } from "./IUser";

export interface IAccountProfile {
    id: number;
    avatarFilename: string;
    about: string;
    user: IUser;
}
