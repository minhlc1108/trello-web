import axios from 'axios'
import { toast } from 'react-toastify'
import { API_ROOT } from '~/utils/constants'

const axiosInstance = axios.create({
  baseURL: API_ROOT
})
axiosInstance.defaults.withCredentials = true

axiosInstance.interceptors.response.use(respone => respone, error => {
  const data = error.response.data
  if (data?.message && typeof data?.message === 'string') {
    toast.error(data.message)
  } else if (data?.status && typeof data?.status === 'string') {
    toast.error(data.status + ` - Status code: ${data.code}`)
  }
  return Promise.reject(error)
})

// Board API
export const fetchBoardDetailsAPI = async (boardId) => {
  const respone = await axiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
  //axios trả kq về property data
  return respone.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const respone = await axiosInstance.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  //axios trả kq về property data
  return respone.data
}

export const moveCardToDifferenceColumnAPI = async (updateData) => {
  const respone = await axiosInstance.put(`${API_ROOT}/v1/boards/supports/move_card`, updateData)
  //axios trả kq về property data
  return respone.data
}

// Column API
export const createNewColumnAPI = async (newColumnData) => {
  const respone = await axiosInstance.post(`${API_ROOT}/v1/columns`, newColumnData)

  return respone.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const respone = await axiosInstance.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  //axios trả kq về property data
  return respone.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const respone = await axiosInstance.delete(`${API_ROOT}/v1/columns/${columnId}`)
  //axios trả kq về property data
  return respone.data
}
// Card API
export const createNewCardAPI = async (newCardData) => {
  const respone = await axiosInstance.post(`${API_ROOT}/v1/cards`, newCardData)
  return respone.data
}

// User API
export const createNewUserAPI = async (newUserData) => {
  const respone = await axios.post(`${API_ROOT}/v1/users`, newUserData)
  return respone.data
}

export const fetchUserAPI = async (email) => {
  const respone = await axiosInstance.get(`${API_ROOT}/v1/users/${email}`)
  return respone.data
}

export const verificationAccount = async (data) => {
  const respone = await axios.put(`${API_ROOT}/v1/users/supports/verification`, data)
  return respone.data
}

export const signInUserAPI = async (data) => {
  const respone = await axiosInstance.post(`${API_ROOT}/v1/users/signIn`, data)
  return respone.data
}