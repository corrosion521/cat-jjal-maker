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

export default MainCard;