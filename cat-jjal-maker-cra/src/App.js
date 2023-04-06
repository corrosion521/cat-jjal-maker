import logo from './logo.svg';
import './App.css';
import React from "react"
import Title from "./components/Title"
import About from "./components/About"

//컴포넌트 분할 연습
import Form from "./components/Form"
import Home from "./components/Home"

//라우터
import { Routes, Route, Link } from "react-router-dom"
import MakeCat from './components/MakeCat';

//[App] :총괄 컴포넌트
const App = () => {
  return (
    <div>
      {/*라우터 :
        import {Routes, Route, Link} from "react-router-dom"
        가져오기
        0. nav 태그 : 다른 페이지 또는 현재 페이지의 다른 부분과 
        연결되는 네비게이션 링크(navigation links)들의 집합을 정의할 때 사용
        1. Link : 메뉴클릭시  html의 a태그와 같음 
          to 속성에 주소 넣기
        2. Routes : 브라우저 패스가 바뀔때마다 어떤 컴포넌트를 매핑해서 보여줄지 정의 
          Route의 집합
      */}
      <nav>
        {/*라우터 : <a href ="/">Home</a> 이랑 같음 */}
        <Link to="/">Home</Link> | <Link to="/about">About</Link> | <Link to='/makecat'>야옹이짤</Link>
      </nav>
      <Routes>
        {/*Link를 클릭하는 순간 to와 path가 같은 Route를 찾음  */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/makecat" element={<MakeCat />} />
      </Routes>





    </div>
  );
};

export default App;
