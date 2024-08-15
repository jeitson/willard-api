export type TreeNode<T = any> = T & {
	id: string;
	parentId: number;
	children?: TreeNode<T>[];
};

export type ListNode<T extends object = any> = T & {
	id: string;
	parentId: number;
};

export function list2Tree<T extends ListNode[]>(
	items: T,
	parentId: number | null = null,
): TreeNode<T[number]>[] {
	return items
		.filter((item) => item.parentId === parentId)
		.map((item) => {
			const children = list2Tree(items, item.id);
			return {
				...item,
				...(children.length ? { children } : null),
			};
		});
}

/**
 * Filtra el árbol y devuelve los datos de la lista
 * @param treeData
 * @param key El campo a filtrar.
 * @param value El valor por el que filtrar.
 */
export function filterTree2List(treeData, key, value) {
	const filterChildrenTree = (resTree, treeItem) => {
		if (treeItem[key].includes(value)) {
			resTree.push(treeItem);
			return resTree;
		}
		if (Array.isArray(treeItem.children)) {
			const children = treeItem.children.reduce(filterChildrenTree, []);

			const data = { ...treeItem, children };

			if (children.length) resTree.push({ ...data });
		}
		return resTree;
	};
	return treeData.reduce(filterChildrenTree, []);
}

/**
 * Filtrar el árbol y mantener la estructura original
 * @param treeData
 * @param predicado
 */
export function filterTree<T extends TreeNode>(
	treeData: TreeNode<T>[],
	predicate: (data: T) => boolean,
): TreeNode<T>[] {
	function filter(treeData: TreeNode<T>[]): TreeNode<T>[] {
		if (!treeData?.length) return treeData;

		return treeData.filter((data) => {
			if (!predicate(data)) return false;

			data.children = filter(data.children);
			return true;
		});
	}

	return filter(treeData) || [];
}

export function deleteEmptyChildren(arr: any) {
	arr?.forEach((node) => {
		if (node.children?.length === 0) delete node.children;
		else deleteEmptyChildren(node.children);
	});
}
