class TreeNode {
    val: any
    left: TreeNode | null
    right: TreeNode | null

    constructor(val: any) {
        this.val = val
        this.left = null
        this.right = null
    }
}

class BinaryTree {
    root: TreeNode | null

    constructor() {
        this.root = null
    }

    insert(val: any) {
        const newNode = new TreeNode(val)
        if (!this.root) {
            this.root = newNode
            return
        }
        let current = this.root
        while (true) {
            if (val < current.val) {
                if (!current.left) {
                    current.left = newNode
                    return
                }
                current = current.left
            } else {
                if (!current.right) {
                    current.right = newNode
                    return
                }
                current = current.right
            }
        }
    }

    delete(val: number): void {
        this.root = this._deleteNode(this.root, val)
    }

    // 内部递归实现
    private _deleteNode(node: TreeNode | null, val: number): TreeNode | null {
        if (node === null) {
            return null
        }

        if (val < node.val) {
            node.left = this._deleteNode(node.left, val)
        } else if (val > node.val) {
            node.right = this._deleteNode(node.right, val)
        } else {
            if (node.left === null) {
                return node.right
            }
            if (node.right === null) {
                return node.left
            }

            let successor = node.right
            while (successor.left !== null) {
                successor = successor.left
            }

            node.val = successor.val

            node.right = this._deleteNode(node.right, successor.val)
        }

        return node
    }
}
