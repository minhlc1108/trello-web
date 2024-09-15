import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import HomeIcon from '@mui/icons-material/Home'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import BurstModeIcon from '@mui/icons-material/BurstMode'
import { ReactComponent as TrelloIcon } from '~/assets/mdi--trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Pagination from '@mui/material/Pagination'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import ModalCreateBoard from '~/components/ModalCreateBoard/ModalCreateBoard'
import { createSearchParams, Link, useSearchParams } from 'react-router-dom'
import { fetchListBoardsAPI } from '~/apis'
import { isEmpty } from 'lodash'
import { DEFAULT_ITEMS_PER_PAGE } from '~/utils/constants'

function BoardList() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)
  const [boards, setBoards] = useState(null)
  const [totalBoards, setTotalBoards] = useState(null)
  useEffect(() => {
    const path = `?${createSearchParams(searchParams)}`
    fetchListBoardsAPI(path).then(res => {
      setBoards(res.boards)
      setTotalBoards(res.totalBoards)
    })

  }, [searchParams])

  const handlePageChange = (event, value) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    setSearchParams({ page: value })
    setPage(value)
  }

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index)
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <ModalCreateBoard open={openModal} handleClose={() => setOpenModal(false)} />
      <Grid container spacing={2} paddingX={2} marginTop={2}>
        <Grid item md={2} xs={12} >
          <nav>
            <List disablePadding>
              <ListItem disablePadding>
                <ListItemButton selected={selectedIndex === 0}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected *': {
                      color: (theme) => theme.palette.primary.main,
                      fontWeight: 'bold'
                    },
                    ':hover': {
                      bgcolor: '#091e4224'
                    }
                  }}
                  onClick={(event) => handleListItemClick(event, 0)}>
                  <ListItemIcon sx={{ minWidth: '35px' }}>
                    <SvgIcon component={TrelloIcon} />
                  </ListItemIcon>
                  <ListItemText primary={<Typography fontWeight={500}>Boards</Typography>} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton selected={selectedIndex === 1}
                  sx={{
                    marginTop: 0.5,
                    borderRadius: 2,
                    '&.Mui-selected *': {
                      color: (theme) => theme.palette.primary.main,
                      fontWeight: 'bold'
                    },
                    ':hover': {
                      bgcolor: '#091e4224'
                    }
                  }}
                  onClick={(event) => handleListItemClick(event, 1)}>
                  <ListItemIcon sx={{ minWidth: '35px' }}>
                    <BurstModeIcon />
                  </ListItemIcon>
                  <ListItemText primary={<Typography fontWeight={500}>Templates</Typography>} />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton selected={selectedIndex === 2}
                  sx={{
                    marginTop: 0.5,
                    borderRadius: 2,
                    '&.Mui-selected *': {
                      color: (theme) => theme.palette.primary.main,
                      fontWeight: 'bold'
                    },
                    ':hover': {
                      bgcolor: '#091e4224'
                    }
                  }}
                  onClick={(event) => handleListItemClick(event, 2)}>
                  <ListItemIcon sx={{ minWidth: '35px' }}>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary={<Typography fontWeight={500}>Home</Typography>} />
                </ListItemButton>
              </ListItem>
            </List>
          </nav>
        </Grid>
        {selectedIndex == 0 &&
          <Grid item xs={12} md={9.5}>
            <Button variant='contained' onClick={() => setOpenModal(true)}>Create new board</Button>
            {!boards ?
              (<Box sx={{ display: 'flex', alignItems: 'center', height: '60vh', width: '100%', justifyContent: 'center', gap: 2 }}>
                <CircularProgress />
                <Typography> Loading...</Typography>
              </Box>) : isEmpty(boards) ? (<Grid marginTop={2} item>No boards</Grid>)
                :
                <Grid container marginTop={1} spacing={2}>
                  {boards.map(b => (
                    <Grid key={b._id} item lg={2} md={3} sm={4} xs={6}>
                      <Card sx={{ width: '100%' }}>
                        <CardMedia
                          component='div'
                          sx={{
                            height: 50,
                            backgroundColor: `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`
                          }}
                        />
                        <CardContent sx={{ '&.MuiCardContent-root': { padding: 1 } }}>
                          <Typography
                            noWrap
                            sx={{
                              fontWeight: 'bold'
                            }} gutterBottom variant="p">
                            {b.title}
                          </Typography>
                          <Typography
                            noWrap
                            variant="body2"
                            color="text.secondary">
                            {b.description}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'flex-end', paddingTop: 0 }}>
                          <Button
                            component={Link}
                            to={`/boards/${b._id}`}
                            size="small" endIcon={<ArrowRightIcon />} >
                            Go to board
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>))
                  }
                  <Grid item xs={12} marginTop={2}>
                    <Pagination sx={{ '.MuiPagination-ul': { justifyContent: 'center' } }} count={Math.ceil(totalBoards / DEFAULT_ITEMS_PER_PAGE)} color="primary" showFirstButton showLastButton page={page} onChange={handlePageChange} />
                  </Grid>
                </Grid>
            }
          </Grid>
        }
        {selectedIndex !== 0 &&
          <Grid item xs={10}>
            You can visit the boards page to see the Trello-clone functionality.
          </Grid>
        }
      </Grid>

    </Container >
  )
}

export default BoardList