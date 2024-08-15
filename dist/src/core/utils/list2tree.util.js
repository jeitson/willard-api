"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list2Tree = list2Tree;
exports.filterTree2List = filterTree2List;
exports.filterTree = filterTree;
exports.deleteEmptyChildren = deleteEmptyChildren;
function list2Tree(items, parentId = null) {
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
function filterTree2List(treeData, key, value) {
    const filterChildrenTree = (resTree, treeItem) => {
        if (treeItem[key].includes(value)) {
            resTree.push(treeItem);
            return resTree;
        }
        if (Array.isArray(treeItem.children)) {
            const children = treeItem.children.reduce(filterChildrenTree, []);
            const data = { ...treeItem, children };
            if (children.length)
                resTree.push({ ...data });
        }
        return resTree;
    };
    return treeData.reduce(filterChildrenTree, []);
}
function filterTree(treeData, predicate) {
    function filter(treeData) {
        if (!treeData?.length)
            return treeData;
        return treeData.filter((data) => {
            if (!predicate(data))
                return false;
            data.children = filter(data.children);
            return true;
        });
    }
    return filter(treeData) || [];
}
function deleteEmptyChildren(arr) {
    arr?.forEach((node) => {
        if (node.children?.length === 0)
            delete node.children;
        else
            deleteEmptyChildren(node.children);
    });
}
//# sourceMappingURL=list2tree.util.js.map