import React from "react"
// 상태 올리기
// 원래 카운터 함수가 Form에 있어서 따로 매개변수로 받을 필요가 없었는데(이미 지꺼니까)
// 이를 상위 컴포넌트(App)으로 올렸기에, 매개변수로 가져와서 쓰는 것이다.
// 당연하지만 디스트럭션을 쓸 수 있다. 
//[Form] : 
//1. 입력폼
//  1)  입력창(대사)에 따른 에러 메시지 관리 
const Form = ({ updateMainCat }) => {

    //함수.test 한글 있는 지 검증하는 함수
    const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);

    //useState의 반환 
    //1인자 :state그 자체
    //2인자 :state를 변경할 수 있는 setState함수(주소)

    //위 코드랑 같음.
    //const CounterState = React.useState(1);
    // const counter = CounterState[0];
    // const setCounter = CounterState[1];
    const [value, setValue] = React.useState("");
    const [errorMessage, setErrorMessage] = React.useState("");

    //[이벤트객체] 들어온 이벤트 객체를 조작.
    function handleInputChange(e) {
        const userValue = e.target.value;
        setErrorMessage("");
        if (includesHangul(userValue)) {
            setErrorMessage("한글은 입력할 수 없습니다.");
        }
        setValue(userValue.toUpperCase());
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        setErrorMessage("");

        if (value === "") {
            setErrorMessage("빈 값으로 만들 수 없습니다.");
            return;
        }
        //입력값 value를 updateMainCat에 넘겨주어,
        // fetch할 때, api로부터 해당 value(입력값)이 적힌
        // 그림을 가져올 수 있도록 함
        updateMainCat(value);
    }

    return (
        <form onSubmit={handleFormSubmit}>
            <input
                type="text"
                name="name"
                placeholder="영어 대사를 입력해주세요"
                value={value}
                onChange={handleInputChange}
            />
            <button type="submit">생성 </button>
            {/* 인라인 스타일링 사용
              //jsx코드에서는 js코드는 밖에 { }쓰는 거 유의하고*/}
            <p style={{ color: "red" }}>{errorMessage}</p>
        </form>
    );
};

export default Form;