import React, { createContext, useState, useContext, useEffect } from "react";
import { useMenu } from "./MenuProvider";

//1. Context 생성
const ShoppingCartContext = createContext();

//2. Provider 컴포넌트 생성
export function ShoppingCartProvider({ children }) {

    //메뉴
    const { menu } = useMenu();

    //장바구니에 담긴 아이템들
    const [cartItems, setCartItems] = useState([]);

    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);

    //로컬스토리지에서 불러오기
    const getLocal = () => {

        if (!menu || menu.length === 0) return;

        //불러오기
        let savedCart = localStorage.getItem("cartItems");
        // 없거나 빈 배열이면 return
        if (!savedCart || savedCart === "[]") return;

        //있으면 검증
        //menu 돌면서 품절이거나 없는 상품인지 확인 <================직원에서는 불필요
        savedCart = JSON.parse(savedCart);

        const updatedCart = savedCart.map((item) => {
            const menuItem = menu.flatMap(category => category.items).find(menuItem => menuItem.id === item.id);

            if (menuItem) {
                //메뉴에 있으면 수량만 적용 <= 그래야 업데이트된 가격,설명 적용가능
                return { ...menuItem, quantity: item.quantity }
            } else {
                // 메뉴에 없으면(커스텀 아이템) 그대로 사용
                return item;
            }

        });

        //적용하기
        setCartItems(updatedCart);
    }

    useEffect(() => {
        getLocal();
    }, [menu]);


    //총 수량, 품목수, 금액 계산 
    useEffect(() => {

        if (!menu || menu.length === 0) return;

        let calPrice = 0;
        let calQuantity = 0;

        cartItems.forEach((item) => {
            calPrice += item.quantity * item.price;
            calQuantity += item.quantity;
        });

        //값 업데이트
        setTotalPrice(calPrice);
        setTotalQuantity(calQuantity);

        //로컬 스토리지 저장
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <ShoppingCartContext.Provider value={{ cartItems, totalPrice, totalQuantity, setCartItems }}>
            {children}
        </ShoppingCartContext.Provider>
    );
}

//3. Custom Hook으로 사용
export function useShoppingCart() {
    return useContext(ShoppingCartContext);
}