import React, { useState } from "react";
import SubHeader from "../../components/SubHeader";
import { Form, FormControl } from "react-bootstrap";
import Footer from "../../components/Footer";
import MotionPage from "../../motions/MotionPage";
import { useMenu } from "../../utils/MenuProvider";
import axiosWithToken from "../../utils/axiosWithToken";
import { useLocation, useNavigate } from "react-router-dom";
import { useTost } from "../../utils/TostProvider";


function EditItemPage() {

    const { menu, fetchMenu } = useMenu();
    const { showTost } = useTost();
    const navigate = useNavigate();

    //수정할 상품
    const location = useLocation();
    const selectedIdx = location.state?.selectedIdx;
    const item = location.state?.item;

    //인풋값
    const [category, setCategory] = useState(menu[selectedIdx].categoryId ?? -1);
    const [name, setName] = useState(item?.name ?? '');
    const [description, setDescription] = useState(item?.description ?? '');
    const [price, setPrice] = useState(item?.price ?? 0);

    //검증
    const [invalidCategory, setInvaildCategory] = useState(false);
    const [invalidName, setInvaildName] = useState(false);
    const [invalidPrice, setInvaildPrice] = useState(false);
    const [fbCategory, setFbCategory] = useState('');
    const [fbName, setFbName] = useState('');
    const [fbPrice, setFbPrice] = useState('');

    //검증
    const validate = () => {

        let valid = true;

        setName(name.trim());
        setDescription(description.trim());

        if (category === -1) {
            setFbCategory('카테고리를 선택해주세요');
            setInvaildCategory(true);
            valid = false;
        }

        if (name.trim() === '') {
            setFbName('상품명은 필수입니다.');
            setInvaildName(true);
            valid = false;
        }

        if (price <= 0) {
            setFbPrice('가격은 0보다 커야합니다.');
            setInvaildPrice(true);
            valid = false;
        }

        return valid;
    }

    //카테고리 onChange함수
    const categoryChange = (index) => {
        setInvaildCategory(false);
        setCategory(menu[index].categoryId);
    }

    //이름 onChange함수
    const nameChange = (value) => {
        setInvaildName(false);
        setName(value);
    }

    //가격 onChange함수
    const priceChange = (value) => {
        setInvaildPrice(false);
        setPrice(Number(value.replace(/[^\d]/g, "")));
    }

    //추가하기버튼
    const submit = () => {

        //검증실행
        if (!validate()) return;

        //서버로 넘길 객체
        const itemParam = {
            categoryId: category,
            name: name.trim(),
            description: description.trim(),
            photo: "", //수정필요
            price: price,
            stock: 100000, //수정필요
        }


        //서버 연동 로직
        axiosWithToken.put(`/item/${item.id}`, itemParam)
            .then((resopne) => {
                fetchMenu();
                navigate(-1);
                showTost("상품 수정 성공");
            })
            .catch((error) => {

                //카테고리명 중복시
                if (error.response && error.response.status === 409) {
                    setInvaildName(true);
                    setFbName('중복된 상품명 입니다.')
                    return;
                }

                alert("상품 수정 실패");
            })
    }


    return (
        <MotionPage>
            <div className='d-flex flex-column h-100  bg-white'>

                <SubHeader title={"상품 수정하기"} />

                <div className='flex-grow-1 overflow-y-auto p-3'>

                    <Form>
                        {/* 카테고리 */}
                        <Form.Group className="mb-3">
                            <Form.Label className='fs-5 fw-medium text-success'>카테고리</Form.Label>
                            <Form.Select size="lg" defaultValue={selectedIdx} onChange={(e) => categoryChange(Number(e.target.value))} isInvalid={invalidCategory}>
                                {menu.map((category, index) => (
                                    <option key={index} value={index}>{category.name}</option>
                                ))}
                            </Form.Select>
                            <FormControl.Feedback type='invalid'>{fbCategory}</FormControl.Feedback>
                        </Form.Group>

                        {/* 이름 */}
                        <Form.Group className="mb-3">
                            <Form.Label className='fs-5 fw-medium text-success'>상품명</Form.Label>
                            <Form.Control size="lg" type="text" placeholder='ex) 상품A' isInvalid={invalidName} value={name} onChange={(e) => nameChange(e.target.value)} />
                            <FormControl.Feedback type='invalid'>{fbName}</FormControl.Feedback>
                        </Form.Group>

                        {/* 설명 */}
                        <Form.Group className="mb-3">
                            <Form.Label className='fs-5 fw-medium text-success'>설명란</Form.Label>
                            <Form.Control size="lg" type="text" placeholder='ex) 50구 / 청색판' value={description} onChange={(e) => setDescription(e.target.value)} />
                        </Form.Group>

                        {/* 가격 */}
                        <Form.Group className="mb-3">
                            <Form.Label className='fs-5 fw-medium text-success'>가격</Form.Label>
                            <Form.Control size="lg" type="text" pattern="\d*" inputMode="numeric" placeholder='ex) 500원' isInvalid={invalidPrice} value={price === 0 ? '' : price.toLocaleString('ko-KR')} onChange={(e) => priceChange(e.target.value.trim())} />
                            <FormControl.Feedback type='invalid'>{fbPrice}</FormControl.Feedback>
                        </Form.Group>
                    </Form>

                </div>

                <Footer
                    value={"수정하기"}
                    show={true}
                    onClick={submit}
                />

            </div>
        </MotionPage>
    );
}

export default EditItemPage;