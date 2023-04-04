import logo from './logo.svg';
import './App.css';
import React from "react"
import Title from "./components/Title"

//[jsonLocalStorage] :localStorage가 string으로만 받는걸 생각해서 ... 만든 함수
const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

//[fetch cat]..utils에 만들어진 거 그대로 가져오긴함. 
//인자 텍스트를 넣어 이미지를 fetch해옴. 그리고 그걸 json으로 바꿈.
const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(
    `${OPEN_API_DOMAIN}/cat/says/${text}?json=true`
  );
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

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

//[CatItem]: 받아온 고양이 이미지
function CatItem(props) {
  return (
    <li>
      <img src={props.img} style={{ width: "150px" }} />
    </li>
  );
}

//[Favorites] : 선호 이미지 목록(favorites) 반복문 통해 반환. 처음에는 메시지출력
function Favorites({ favorites }) {
  //1. favorites가 비어있으면, 조건부 렌더링. 
  // 조건에 따른 렌더링 선택
  if (favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>;
  }

  return (
    <ul className="favorites">
      {/*//map이용해서 반복문 이용
						//key가 있어야 리액트가 최적화가능 */}
      {favorites.map((cat) => (
        <CatItem img={cat} key={cat} />
      ))}
    </ul>
  );
}

//[MainCard] : 이미지, 함수, 하트클릭여부 포함한 화면. 대문화면 
const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {
  //그 여부에 따른 하트 표시
  const heartIcon = alreadyFavorite ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button onClick={onHeartClick}>{heartIcon}</button>
    </div>
  );
};

//[App] :총괄 컴포넌트
const App = () => {
  const CAT1 =
    "https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react";
  const CAT2 =
    "https://cataas.com/cat/BxqL2EjFmtxDkAm2/says/inflearn";
  const CAT3 =
    "https://cataas.com/cat/18MD6byVC1yKGpXp/says/JavaScript";

  // [useState의 초기값을 함수로 지정하기] 
  // 불필요한 localStorage접근 하지 않음.
  // state,ui변경시 재 렌더링 되는데, 이 때마다 localStorage에 접근하는 것이아닌
  // 한 번만 접근하고, 이후로는 캐시데이터를 사용한다.(초기값 지정이기에 매번 똑같은 작업일 것이다)
  const [counter, setCounter] = React.useState(
    () => {
      return jsonLocalStorage.getItem("counter") || 1 //조건부렌더링 위해
    }
  );
  const [mainCat, setMainCat] = React.useState(CAT1);
  const [favorites, setFavorites] = React.useState(
    jsonLocalStorage.getItem("favorites") || []
  );

  //favorites안에 mainCat이 있는지 여부
  const alreadyFavorite = favorites.includes(mainCat);

  //[async,wait로 비동기 async빠른 버튼 클릭시 setCounter와 counter의 미스매치
  async function setInitialCat() {
    const newCat = await fetchCat("First cat");
    console.log(newCat);
    setMainCat(newCat);
  }


  //   - 이와 같이 setIntialCat();을 App컴포넌트에서 호출하면
  // - 무한정으로 setIntialCat()이 실행된다.
  //     - 맨 처음 렌더링하고, 그 과정에서 setIntialCat을 실행하여, 다시 그려주고(렌더링)
  //     - 다시 그려주는 과정에서 또 setIntialCat을 실행하게 되고, 또 그려주고
  //     - 이런식으로 무한정으로 그려주게 되었기 때문이다.

  //이거만 이렇게 해두면 계속 콘솔 찍힘. 즉 여러번 실행됨.
  // 앱 실행시에 한 번만 불리는 게 아니라..
  // 그럼 어떻게 해야 한 번에 불릴까
  //setInitialCat();


  // [useEffect : UI가 업데이트 될 때마다만 찍힘]
  // 두 번째 인자: 불리는 때 제한
  // [counter] : counter변수가 바뀔(초기화) 때마다 찍힘
  // 따라서 새로고침하는 경우에는 안찍히고
  //counter가 처음 한번 초기화된 경우와, "생성"버튼을 누르는 경우만
  //"헬로"가 찍힌다.
  React.useEffect(() => {
    console.log("헬로");
  }, [counter]);

  React.useEffect(() => {
    setInitialCat();
  }, []);

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);

    setMainCat(newCat);
    //const nextCounter = counter + 1;
    //setCounter(nextCounter);

    //[prev 이전 카운터
    //함수 형태로 인자를 넘기는 것을 생각해보자.]
    //https://blog.naver.com/corrosion521/223050388701
    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    })

  }

  //[handleHeartClick] : favorites 추가.
  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCat];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }

  return (
    <div>
      {/*조건부렌더링 : counter가 null이면 ‘n번째’를 삭제하고, ‘고양이 가라사대’만 보여주기
      카운터는 useState씀.
      그런데, 그 카운터의 초기값은 LocalStorage에서 가져오게됨.
      카운터의 변경(Setitem은 updateMaincat할 때마다 올라감 
      없을 때의 경우를 조건부 렌더링 해보면 될 것 같다.. 
      그래서 3항연산자 이용해서 counter가 1인 경우를 생각했다.
      참고로 return문 안에서는 3항연산자는 가능하지만, if는 안됨.
      */}
      {(counter == 1) ? <Title>야옹이</Title> : <Title>{counter}번째 야옹</Title>}
      <Form updateMainCat={updateMainCat} />
      <MainCard
        img={mainCat}
        //event handler 함수는 handle
        //하지만, 어떤 함수를 prop으로 넘겨주는 함수면 on임.
        onHeartClick={handleHeartClick}

        //여부 보냄 컴포넌트로
        alreadyFavorite={alreadyFavorite}
      />
      <Favorites favorites={favorites} />
    </div>
  );
};

export default App;
