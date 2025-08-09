let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8017'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-8779.onrender.com'
}
export const API_ROOT = apiRoot
export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

export const BOARD_ROLES = {
  ADMIN: 'admin',
  MEMBER: 'member'
}

export const CARD_MEMBERS_ACTION = {
  JOIN: 'join',
  LEAVE: 'leave'
}

export const BOARD_INVITATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected'
}

export const DEFAULT_ITEMS_PER_PAGE = 18