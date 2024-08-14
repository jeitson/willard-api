export type TreeNode<T = any> = T & {
    id: string;
    parentId: number;
    children?: TreeNode<T>[];
};
export type ListNode<T extends object = any> = T & {
    id: string;
    parentId: number;
};
export declare function list2Tree<T extends ListNode[]>(items: T, parentId?: number | null): TreeNode<T[number]>[];
export declare function filterTree2List(treeData: any, key: any, value: any): any;
export declare function filterTree<T extends TreeNode>(treeData: TreeNode<T>[], predicate: (data: T) => boolean): TreeNode<T>[];
export declare function deleteEmptyChildren(arr: any): void;
