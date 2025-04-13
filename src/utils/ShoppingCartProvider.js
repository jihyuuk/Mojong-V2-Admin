import React, { createContext, useState, useContext, useEffect } from "react";

//1. Context 생성
const ShoppingCartContext = createContext();

//2. Provider 컴포넌트 생성
export function ShoppingCartProvider({ children, menu }) {

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
        //menu 돌면서 품절이거나 없는 상품인지 확인
        savedCart = JSON.parse(savedCart);

        const updatedCart = savedCart.map((item) => {
            const menuItem = menu.flatMap(category => category.items).find(menuItem => menuItem.id === item.id);
          
            //현재 판매중이 아니거나 재고가 없으면 지우기
            if (!menuItem || menuItem.stock <= 0) return null;
            //재고 이하로 수량 조절하기
            const validQuantity = Math.min(item.quantity, menuItem.stock); 

            //업데이트
            return { ...menuItem, quantity: validQuantity };
          }).filter(Boolean); // null 제거

        //적용하기
        setCartItems(updatedCart);
    }

    useEffect(() => {
        getLocal();
    }, [menu]);


    //총 수량, 품목수, 금액 계산 
    useEffect(() => {
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
        //id랑 수량만 저장하기
        localStorage.setItem("cartItems", JSON.stringify(
            cartItems.map(item => ({
              id: item.id,
              quantity: item.quantity
            }))
          ));
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