import axios from 'axios'
import { toast } from 'react-toastify'
import { API_ROOT } from '~/utils/constants'
import { signOut } from '~/redux/slices/userSlice'

let store

export const injectStore = _store => {
  store = _store
}

const axiosInstance = axios.create({
  headers: {
    'Cache-Control': 'no-cache'
  },
  withCredentials: true,
  timeout: 1000 * 60 * 10
})
// axiosInstance.defaults.timeout = 1000 * 60 * 10
// axiosInstance.defaults.withCredentials = true

axiosInstance.interceptors.response.use(respone => respone, async (error) => {
  const data = error.response.data
  if (data.statusCode === 401) {
    store.dispatch(signOut())
  }
  const originalRequest = error.config
  if (data.statusCode === 410 && !originalRequest._retry) {
    originalRequest._retry = true
    return refreshTokenAPI().then((data) => {
      return axiosInstance.request(originalRequest)
    }).catch((error) => {
      store.dispatch(signOut())
    })
  }

  if (data?.message && typeof data?.message === 'string') {
    toast.error(data.message)
  } else if (data?.statusCode && typeof data?.statusCode === 'string') {
    toast.error(data.statusCode + ` - Status code: ${data.statusCode}`)
  }
  return Promise.reject(error)
})

// Board API
export const createNewBoardAPI = async (newBoardData) => {
  const respone = await axiosInstance.post(`${API_ROOT}/v1/boards`, newBoardData)
  return respone.data
}

export const fetchListBoardsAPI = async (path) => {
  const respone = await axiosInstance.get(`${API_ROOT}/v1/boards${path}`)
  return respone.data
}

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

export const updateUserAPI = async (updateData) => {
  const respone = await axiosInstance.put(`${API_ROOT}/v1/users`, updateData)
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

export const signOutUserAPI = async () => {
  const respone = await axiosInstance.get(`${API_ROOT}/v1/users/signOut`)
  return respone.data
}

export const refreshTokenAPI = async () => {
  const respone = await axiosInstance.get(`${API_ROOT}/v1/users/refreshToken`)
  return respone.data
}