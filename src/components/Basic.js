import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { change_page, change_set, minus_list, plus_list } from "../store";
import { Set_header, Set_main, Set_notice, Set_around, Set_property, Set_charge, Set_review, Set_vod, Set_map } from './setting_page/setting_page';
import './setting_page/set2.css';
import axios from "axios";
import Set_NaverVerification from "./setting_page/Set_NaverVerification";

function Basic(props){
  let store = useSelector((state)=>{return state.current_set});
  let select = store;
  let [menuSetting, setMenuSetting] = useState();
  let id = window.localStorage.getItem('id');
  let login_key = window.localStorage.getItem('login_key');
  const config = {
    headers : {
      'Authorization': `Bearer ${login_key}`
    }
  }
  let dispatch = useDispatch();

  useEffect(()=>{
    dispatch(change_page('basic'));
  }, [menuSetting]);

  useMemo(()=>{
    // axios.get 대신 목업 데이터 세팅
    const mockBasicData = {
      property_show: "Y",
      notice_show: "Y",
      around_show: "Y",
      charge_show: "N",
      review_show: "Y",
      vod_show: "N",
      map_show: "Y",
      naver_reserve_show: "Y"
    };
    setMenuSetting(mockBasicData);
  }, []);

  console.log("menuSetting");
  console.log(menuSetting);

  if(menuSetting){
    return(
      <div className="page-container">
        <div className="page-head">
          <div>
            <h2>홈페이지 설정</h2>
            <p className="sub">
              홈페이지 구성과 노출 상태를 관리합니다.
            </p>
          </div>
        </div>

        {/* 홈페이지 설정 탭 */}
        <ul className="grid hompage-set-tabs">
          <li onClick={()=>{ dispatch(change_set(0)) }} className={select === 0 ? "on" : null}>
            <h5>기본</h5>
          </li>
          <li onClick={()=>{ dispatch(change_set(1)) }} className={select === 1 ? "on" : null}>
            <h5>메인페이지</h5>
          </li>
          <li onClick={()=>{ dispatch(change_set(9)) }} className={select === 9 ? "on" : null}>
            <h5>검색엔진 등록</h5>
            <div className="status">
              { menuSetting.naver_reserve_show=== "Y" ? <span className="on">등록됨</span> : <span className="off">미등록</span> }
            </div>
          </li>
        </ul>

        <div className="content_card">
          {
            {
              0 : <Set_header></Set_header>,
              1 : <Set_main></Set_main>,
              // 2 : <Set_notice></Set_notice>,
              // 3 : <Set_around></Set_around>,
              // 4 : <Set_property></Set_property>,
              // // 5 : <Set_charge></Set_charge>,
              // 6 : <Set_review></Set_review>,
              // 7 : <Set_vod></Set_vod>,
              // 8 : <Set_map></Set_map>,
              9 : <Set_NaverVerification></Set_NaverVerification>,
            }[select]
          }
        </div>
      </div>
    )
  }
}

export default Basic;