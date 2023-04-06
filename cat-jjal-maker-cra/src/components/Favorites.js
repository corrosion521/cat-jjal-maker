import CatItem from "./CatItem";

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

export default Favorites