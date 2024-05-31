import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

/**
 * Đối với sd axios
 * Tất cả các function bên dưới chỉ có request và lấy data, mà không có try-catch bắt lỗi
 * Lý do: phía FE chúng ta không cần thiết phải làm như vậy đối với mọi request bời nó sẽ gây ra việc
 * thừa code catch lỗi quá nhiều
 * Giải pháp: dùng Interceptors trong axios
 * có thể hiểu đơn giản Interceptors là cách mà ta đánh chặn giữa req và res để xử lý logic mà ta muốn
 */
// Board API
export const fetchBoardDetailsAPI = async (boardId) => {
  const respone = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  //axios trả kq về property data
  return respone.data
}

// Column API
export const createNewColumnAPI = async (newColumnData) => {
  const respone = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)

  return respone.data
}

// Card API
export const createNewCardAPI = async (newCardData) => {
  const respone = await axios.post(`${API_ROOT}/v1/cards`, newCardData)

  return respone.data
}