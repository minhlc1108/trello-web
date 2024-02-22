import Box from '@mui/system/Box'
import Card from './Card/Card'

function ListCard({ cards }) {
  return (
    < Box sx={{
      margin: '0 5px',
      padding: '0 5px',
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      overflowX: 'hidden',
      overflowY: 'auto',
      maxHeight: (theme) => `calc(
        ${theme.trello.boardContentHeight} - 
        ${theme.spacing(5)} - 
        ${theme.trello.columnHeaderHeight} - 
        ${theme.trello.columnFooterHeight}
        )`,
      '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced0da' },
      '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#bfc2cf' }
    }}>
      {cards?.map(card => <Card key={card._id} card={card} />)}
    </Box >
  )
}

export default ListCard