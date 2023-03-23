import logo from './logo.svg';
import './App.css';
import React from "react"
import Title from "./components/Title"

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(
    `${OPEN_API_DOMAIN}/cat/says/${text}?json=true`
  );
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

const Form = ({ updateMainCat }) => {
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [value, setValue] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

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
      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
};

function CatItem(props) {
  return (
    <li>
      <img src={props.img} style={{ width: "150px" }} />
    </li>
  );
}

function Favorites({ favorites }) {
  //1. favorites가 비어있으면, 조건부 렌더링. 
  // 조건에 따른 렌더링 선택
  if (favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>;
  }

  return (
    <ul className="favorites">
      {favorites.map((cat) => (
        <CatItem img={cat} key={cat} />
      ))}
    </ul>
  );
}

//2. alreadyFavorite도 넘김
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

const App = () => {
  const CAT1 =
    "https://cataas.com/cat/HSENVDU4ZMqy7KQ0/says/react";
  const CAT2 =
    "https://cataas.com/cat/BxqL2EjFmtxDkAm2/says/inflearn";
  const CAT3 =
    "https://cataas.com/cat/18MD6byVC1yKGpXp/says/JavaScript";
  {/*퀴즈 : 카운터는 useState씀.
   그런데, 그 카운터의 초기값은 LocalStorage에서 가져오게됨.
  카운터의 변경(Setitem은 updateMaincat할 때마다 올라감 
  없을 때의 경우를 조건부 렌더링 해보면 될 것 같다.. 
  */}
  const [counter, setCounter] = React.useState(

    jsonLocalStorage.getItem("counter") || 1

  );
  const [mainCat, setMainCat] = React.useState(CAT1);
  const [favorites, setFavorites] = React.useState(
    jsonLocalStorage.getItem("favorites") || []
  );

  //favorites안에 mainCat이 있는지 여부
  const alreadyFavorite = favorites.includes(mainCat);

  async function setInitialCat() {
    const newCat = await fetchCat("First cat");
    console.log(newCat);
    setMainCat(newCat);
  }

  React.useEffect(() => {
    setInitialCat();
  }, []);

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);

    setMainCat(newCat);
    const nextCounter = counter + 1;
    setCounter(nextCounter);
    jsonLocalStorage.setItem("counter", nextCounter);
  }

  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCat];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }

  return (
    <div>
      {/*퀴즈 : counter가 null이면 ‘n번째’를 삭제하고, ‘고양이 가라사대’만 보여주기*/}

      {(counter == 1) ? <Title>고양이 가라사대</Title> : <Title>{counter}번째 고양이 가라사대</Title>}
      <Form updateMainCat={updateMainCat} />
      <MainCard
        img={mainCat}
        onHeartClick={handleHeartClick}

        //여부 보냄 컴포넌트로
        alreadyFavorite={alreadyFavorite}
      />
      <Favorites favorites={favorites} />
    </div>
  );
};

export default App;
