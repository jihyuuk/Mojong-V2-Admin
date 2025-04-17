import React, { useState } from "react";
import Footer from "./Footer";
import { ListGroup } from "react-bootstrap";
import DeleteCategoryModal from "./modals/DeleteCategoryModal";
import EditCategoryModal from "./modals/EditCategoryModal";
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import axiosWithToken from "../utils/axiosWithToken";
import { useTost } from "../utils/TostProvider";
import { useMenu } from "../utils/MenuProvider";
import AddCategoryModal from "./modals/AddCategoryModal";

function CategoryView() {

    //토스트
    const { showTost } = useTost();

    //메뉴, 새로고침
    const { menu, setMenu, fetchMenu } = useMenu();

    //선택된 카테고리
    const [selected, setSelected] = useState();

    //모달
    const [modal, setModal] = useState('');
    const close = () => setModal('');

    const showDelete = (category) => {
        setSelected(category);
        setModal("delete");
    }

    const showEdite = (category) => {
        setSelected(category);
        setModal("edit");
    }

    const showAdd = () => {
        setModal("add");
    }

    //드래그 구현
    const handleDragEnd = (result) => {

        //변경 필요한지 감지
        const { source, destination } = result;
        if (!destination || source.index === destination.index) return;

        //배열복사
        const copyArr = Array.from(menu);
        //드래그할 요소 빼기
        const [moved] = copyArr.splice(source.index, 1);
        //드래그할 요소 위치에 집어넣기
        copyArr.splice(destination.index, 0, moved);

        //적용
        setMenu(copyArr);

        // 서버로 순서 저장 요청 (예: categoryId 배열로 보내기)
        const orderedIds = copyArr.map(cat => cat.categoryId);

        axiosWithToken.put('/category/seq', orderedIds)
            .then(() => {
                fetchMenu();
                showTost("순서 변경성공")
            })
            .catch(() => {
                fetchMenu();
                alert("순서 변경 실패");
            });
    };



    return (
        <>

            {modal === "delete" && <DeleteCategoryModal category={selected} close={close} />}
            {modal === "edit" && <EditCategoryModal category={selected} close={close} />}
            {modal === "add" && <AddCategoryModal close={close} />}


            <div className='flex-grow-1 overflow-y-auto bg-white px-2 pb-5'>
                {/* 총 n개 */}
                <div className='p-2 fw-midium text-secondary'>총 <span className='fw-semibold'>{menu.length}</span>개</div>


                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided) => (
                            <ListGroup ref={provided.innerRef} {...provided.droppableProps}>
                                {menu.map((category, index) => (
                                    <Draggable key={category.categoryId} draggableId={category.categoryId.toString()} index={index}>
                                        {(provided) => (
                                            <div className="my-1" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <ListGroup.Item className='pe-0 rounded-3 border-success-subtle'>
                                                    <div className='d-flex justify-content-between align-items-center py-2'>
                                                        <div className='fs-5 fw-medium'><span className='text-success'>{index + 1}.</span> {category.name}</div>
                                                        <div>
                                                            <span className='p-2' onClick={() => showEdite(category)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-pencil-square text-success" viewBox="0 0 16 16">
                                                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                                                    <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                                                </svg>
                                                            </span>

                                                            <span className='p-2' onClick={() => showDelete(category)}>
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

            <Footer value={"카테고리 추가하기"} show={true} onClick={showAdd} />
        </>
    )
}

export default CategoryView;