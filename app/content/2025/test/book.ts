interface Book {
    bookId: string | number
    borrowCount: number
}

function getTopKBooksSort(books: Book[], k: number): (string | number)[] {
    if (k <= 0) return []
    if (k >= books.length) return books.map((book) => book.bookId)

    return [...books]
        .sort((a, b) => {
            // 优先按借阅次数降序排列
            if (b.borrowCount !== a.borrowCount) {
                return b.borrowCount - a.borrowCount
            }
            // 借阅次数相同，按 bookId 升序排列
            return String(a.bookId).localeCompare(String(b.bookId))
        })
        .slice(0, k)
        .map((book) => book.bookId)
}
