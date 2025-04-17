import React, { useState } from "react";
import Footer from "./Footer";
import { Form, ListGroup } from "react-bootstrap";
import DeleteItemModal from "./modals/DeleteItemModal";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import axiosWithToken from "../utils/axiosWithToken";
import { useTost } from "../utils/TostProvider";
import { useMenu } from "../utils/MenuProvider";
import { useNavigate } from "react-router-dom";

function ItemView() {

    const { menu, setMenu, fetchMenu } = useMenu();
    const { showTost } = useTost();
    const navigate = useNavigate();

    //선택된 카테고리 idx
    const [selectedIdx, setSelectedIdx] = useState(0);
    const selectedItems = menu[selectedIdx]?.items || [];


    //모달
    const [selectedItem, setSelectedItem] = useState();
    const [modal, setModal] = useState('');
    const close = () => setModal('');

    const showDelete = (item) => {
        setSelectedItem(item);
        setModal("delete");
    }


    //드래그 구현
    const handleDragEnd = (result) => {

        const { source, destination } = result;

        // 1. 목적지가 없거나 같은 위치면 리턴
        if (!destination || source.index === destination.index) return;

        // 2. 복사 및 순서 변경
        const category = menu[selectedIdx];
        const updatedItems = Array.from(category.items);
        const [movedItem] = updatedItems.splice(source.index, 1);
        updatedItems.splice(destination.index, 0, movedItem);

        const updatedMenu = [...menu];

        updatedMenu[selectedIdx] = {
            ...category,
            items: updatedItems
        };

        // 3. 변경된 상태 반영
        setMenu(updatedMenu);


        // 4. 서버에 순서 전송
        const orderedItemIds = updatedItems.map(item => item.id);

        axiosWithToken.put('/item/seq', orderedItemIds)
            .then(() => {
                fetchMenu();
                showTost("순서 변경 성공");
            })
            .catch(() => {
                fetchMenu();
                alert("순서 변경 실패");
            });
    };


    return (
        <>

            {modal === "delete" && <DeleteItemModal item={selectedItem} close={close} />}

            <div className='flex-grow-1 overflow-y-auto bg-white px-2 pb-5'>

                {/* select 영역 */}

                <div className="mt-2 fs-5 fw-semibold ">카테고리</div>

                <div className='mt-2 mb-1' onChange={(e) => setSelectedIdx(Number(e.target.value))}>
                    <Form.Select className='fs-5 text-success fw-semibold border-success'>
                        {menu.map((category, index) => (
                            <option key={index} value={index}>{category.name}</option>
                        ))}
                    </Form.Select>
                </div>

                {/* 총 n개 */}
                <div className='p-2 fw-midium text-secondary'>상품 총 <span className='fw-semibold'>{selectedItems.length}</span>개</div>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="droppable2">
                        {(provided) => (
                            <ListGroup className="p-2 bg-body-tertiary" ref={provided.innerRef} {...provided.droppableProps}>
                                {selectedItems.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                        {(provided) => (
                                            <div className="my-1" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <ListGroup.Item key={item.itemId} className="py-2 rounded-3 border-success-subtle">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <div className='fs-5 fw-medium'><span className='text-success'>{index + 1}. </span>{item.name}</div>
                                                            <div className="text-secondary">
                                                                {item.price.toLocaleString()}원
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className='p-2' onClick={() => navigate("/product/edit", { state: { item, selectedIdx } })}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-pencil-square text-success" viewBox="0 0 16 16">
                                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                                </svg>
                                                            </span>

                                                            <span className='p-2' onClick={() => showDelete(item)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-trash3 text-danger" viewBox="0 0 16 16">
                                                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5" />
                                                                </svg>
                                                            </span>
                                                        </div>

                                                    </div>
                                                </ListGroup.Item>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </ListGroup>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            <Footer value={"상품 추가하기"} show={true} onClick={() => navigate("/product/add")} />
        </>
    )
}

export default ItemView;