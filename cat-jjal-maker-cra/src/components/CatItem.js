//[CatItem]: 받아온 고양이 이미지
function CatItem(props) {
    return (
        <li>
            <img src={props.img} style={{ width: "150px" }} />
        </li>
    );
}

export default CatItem;