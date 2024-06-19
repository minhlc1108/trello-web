import Box from '@mui/system/Box'
import ListColumns from './ListColumns/ListColumns'
import {
  DndContext,
  // PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  // rectIntersection,
  getFirstCollision
  // closestCenter
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'
import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatter'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({ board,
  moveColumns,
  moveCardInTheSameColumn,
  moveCardToDifferenceColumn,
  deleteColumnDetails }) {
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  // Yêu cầu chuột di chuyển 10px thì kích hoạt event (fix click gọi event)
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  // nhấn giữ 250ml và dung sai 500px để kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  //cùng 1 thời điểm chỉ có 1 phần tử đang đc kéo (column or card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)
  // điểm va chạm cuối cùng trc đó
  const lastOverId = useRef(null)


  useEffect(() => {
    // column đã được sắp xếp ở Board/_id.jsx
    setOrderedColumns(board.columns)
  }, [board])

  const findColumnById = (cardId) => {
    return orderedColumns.find(column => column.cards.map(card => card._id)?.includes(cardId))
  }

  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerMethod
  ) => {
    setOrderedColumns(prevColumns => {
      // tìm vị trí card trong column
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      let newCardIndex

      const isBelowOverItem = active.rect.current.translated
        && active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // clone mảng orderedColumn cũ ra một cái mới để xử lý data rồi return cập nhật lại state mới
      const nextColumns = cloneDeep(prevColumns)

      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      // column cũ
      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards?.filter(card => card._id !== activeDraggingCardId)
        // thêm Placehoder Card nếu column rỗng : bị kéo hết card đi không còn cái nào nữa
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        // cập nhật lại cardOrderids
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      if (nextOverColumn) {
        // ktra xem card đang kéo có tồn tại trong overColumn chưa, nếu có xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards?.filter(card => card._id !== activeDraggingCardId)
        //update lai column id
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: overColumn._id
        }
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        // xoá placeholder card nếu đang tồn tại
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)
        //cập nhật lại cardOrderids
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      if (triggerMethod === 'handleDragEnd') {
        moveCardToDifferenceColumn(
          activeDraggingCardId,
          oldColumnWhenDraggingCard._id,
          nextOverColumn._id,
          nextColumns
        )
      }

      return nextColumns
    })
  }

  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
    if (event?.active?.data?.current?.columnId)
      setOldColumnWhenDraggingCard(findColumnById(event?.active?.id))
  }

  const handleDragOver = (event) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    const { active, over } = event
    if (!active || !over) return

    //card đang kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // card đang tương tác (trên hoặc dưới so với card được kéo ở trên)
    const { id: overCardId } = over

    // tìm 2 column tương ứng theo cardId
    const activeColumn = findColumnById(activeDraggingCardId)
    const overColumn = findColumnById(overCardId)

    if (!activeColumn || !overColumn) return

    // nếu 2 column khác nhau
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver')
    }
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (!active || !over) return

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      //card đang kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // card đang tương tác (trên hoặc dưới so với card được kéo ở trên)
      const { id: overCardId } = over
      // tìm 2 column tương ứng theo cardId
      const activeColumn = findColumnById(activeDraggingCardId)
      // ở dragover đã xóa card placeholder ở orderedColumn rồi nên k thấy placeholder card trong đó sẽ k tìm đc column over
      const overColumn = findColumnById(overCardId) || overCardId.includes('placeholder-card') ? activeColumn : undefined

      if (!activeColumn || !overColumn) return

      // drag over chay trc drag end nó set lại state 1 lần r nên phải dùng state oldColumnWhenDraggingCard
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd')
      } else {
        // xử lý kéo thả card trong cùng 1 column
        const oldCardIndex = oldColumnWhenDraggingCard?.cards.findIndex(c => c._id === activeDragItemId)
        const newCardIndex = overColumn?.cards.findIndex(c => c._id === overCardId)
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardIds = dndOrderedCards.map(c => c._id)
        //gọi update state để tránh delay hoặc flickering lúc kéo thả cần chờ gọi api
        setOrderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)
          const targetColumn = nextColumns.find(c => c._id === overColumn._id)
          // update lại data column có card đang kéo thả
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCardIds
          return nextColumns
        })
        //tạm thời gọi hàm prop của Boards/_id.jsx để cập nhật board sau này dùng redux thay thế
        moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardIds, oldColumnWhenDraggingCard._id)
      }
    }

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      if (active.id !== over.id) {
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // vẫn gọi update state để tránh delay hoặc flickering lúc kéo thả cần chờ gọi api
        setOrderedColumns(dndOrderedColumns)

        //tạm thời gọi hàm prop của Boards/_id.jsx để cập nhật board sau này dùng redux thay thế
        moveColumns(dndOrderedColumns)
      }
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  const collisionDetectionStrategy = useCallback((args => {
    if (activeDragItemType == ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({
        ...args
      })
    }

    const pointerIntersections = pointerWithin(args)
    //fix triệt để bug flickering : kéo card có img cover lớn lên phía trên cùng ra khỏi khu vực kéo thả
    if (!pointerIntersections?.length) return

    //thuật toán phát hiện va cham sẽ trả về một mảng các va chạm ở đây
    // const intersections = pointerIntersections.length > 0 ? pointerIntersections : rectIntersection(args)

    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      // nếu overId là column thì sẽ tìm tới cardId gần nhất bên trong khu vực va chạm đó dựa vào thuật toán phát hiện
      // va chạm closetCenter hoặc closetCorners. tuy nhiên trg hợp này closetCorners mượt hơn
      const checkColumn = orderedColumns.find(c => c._id === overId)
      if (checkColumn) {
        // console.log("before", overId)
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(containter => {
            return containter.id !== overId && (checkColumn?.cardOrderIds?.includes(containter.id)) // tim cac container card trong column
          })
        })[0]?.id
        // console.log('after', overId)
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    return lastOverId.current ? [{ id: lastOverId.current }] : []

  }), [activeDragItemType, orderedColumns])

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: 0.5 } } })
  }
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      //bi flickering
      // collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2 '),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        padding: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} deleteColumnDetails={deleteColumnDetails} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType == ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData}></Column>}
          {(activeDragItemType == ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData}></Card>}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
