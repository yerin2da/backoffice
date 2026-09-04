import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux"
import { change_page } from "../store";
import { useNavigate } from "react-router-dom";

function Main(){

  let navigate = useNavigate();
  let dispatch = useDispatch();
  useEffect(()=>{
    dispatch(change_page(''));
    navigate('/basic');
  },[]);


  return(
    <div className="main sections">
      <div className="width_con">
        <div className="row row1">
          <div className="conts cont1">
            <h5>방문자 수</h5>
            <div className="count">
              <div className="today">
                <span className="txt">오늘</span>
                <span className="nums">00</span>
              </div>
              <div className="yesterday">
                <span className="txt">어제</span>
                <span className="nums">00</span>
              </div>
            </div>
          </div>
          <div className="conts cont2"></div>
          <div className="conts cont3"></div>
          <div className="conts cont4"></div>
        </div>
      </div>
    </div>
  )
}

export default Main