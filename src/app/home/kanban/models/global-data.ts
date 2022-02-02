import { Category } from "./category";
import { Workflows } from "./workflows";

export interface GlobalData {
    workflows: Workflows[];
    categories: Category[];
}