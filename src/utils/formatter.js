export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

/*xử lý bug logic dnd-kit khi column rỗng
         phía FE sẽ tạo ra card đặc biệt: placehoder Card không liên quan tới backend
         card đặc biêt này đc ẩn ở UI người dùng
         Cấu trúc id của những cái card này để unique rất đơn giản, không cần phải làm random phức tạp
         "columnId-placehoder-card" (mỗi column chỉ có thể có tối đa một cái placehoder Card)
         *Quan trọng khi tạo: phải đầy đủ: {_id, boardId, columnId,FE_PlacehoderCard }
*/
export const generatePlacehoderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column.columnId,
    FE_PlaceholderCard: true
  }
}
