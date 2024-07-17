import {Category} from "../../models";

export function checkCategoryExists(id: string, categories: Category[]) {
    for (const category of categories) {
        if (category.id === id) {
            return true;
        }
        if (category.children && checkCategoryExists(id, category.children)) {
            return true;
        }
    }
    return false;
}

