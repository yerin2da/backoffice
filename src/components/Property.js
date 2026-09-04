import { useEffect, useMemo, useState } from "react" 
import { useDispatch, useSelector } from "react-redux"; 
import { change_page, minus_list, plus_list } from "../store"; 
import Property_list from './property_page/Property_list'; 
import './board_page/brd.css'; 

// API 호출을 대체할 목업 데이터 (부동산 관련 용어 제외)
const mockRecordData = {
  counts: {
    all: { total_count: 4 },
    "3": { total_count: 1 }
  },
  display_counts: {
    "1": { total_count: 3 },
    "2": { total_count: 1 }
  },
  rows: [
    {
      property_no: 101,
      transaction_type: 'sale',
      transaction_type_txt: '일반',
      property_type: 'office',
      property_type_txt: '전자기기',
      property_name: '고성능 게이밍 노트북 팝니다',
      addr_sigungu: '서울시',
      addr_dong: '강남구',
      sale_price: 150000,
      jeonse_price: 0,
      deposit_price: 0,
      monthly_rent: 0,
      status: '1',
      status_txt: '거래가능',
      display_yn: '1',
      display_yn_txt: '노출',
      view_count: 128,
      updated_at: '2026-03-01'
    },
    {
      property_no: 102,
      transaction_type: 'monthly',
      transaction_type_txt: '렌탈',
      property_type: 'etc',
      property_type_txt: '도서/음반',
      property_name: '개발자 필독서 전권 세트',
      addr_sigungu: '경기도',
      addr_dong: '성남시',
      sale_price: 0,
      jeonse_price: 0,
      deposit_price: 10000,
      monthly_rent: 2000,
      status: '2',
      status_txt: '거래중',
      display_yn: '1',
      display_yn_txt: '노출',
      view_count: 45,
      updated_at: '2026-02-28'
    },
    {
      property_no: 103,
      transaction_type: 'jeonse',
      transaction_type_txt: '예약',
      property_type: 'commercial',
      property_type_txt: '의류/잡화',
      property_name: '미개봉 스마트워치 블랙',
      addr_sigungu: '부산시',
      addr_dong: '해운대구',
      sale_price: 0,
      jeonse_price: 35000,
      deposit_price: 0,
      monthly_rent: 0,
      status: '3',
      status_txt: '거래완료',
      display_yn: '2',
      display_yn_txt: '비노출',
      view_count: 310,
      updated_at: '2026-02-25'
    },
    {
      property_no: 104,
      transaction_type: 'sale',
      transaction_type_txt: '일반',
      property_type: 'apt',
      property_type_txt: '생활가전',
      property_name: '스마트 공기청정기 대형',
      addr_sigungu: '인천시',
      addr_dong: '연수구',
      sale_price: 28000,
      jeonse_price: 0,
      deposit_price: 0,
      monthly_rent: 0,
      status: '1',
      status_txt: '거래가능',
      display_yn: '1',
      display_yn_txt: '노출',
      view_count: 89,
      updated_at: '2026-02-20'
    }
  ]
};

function Property(){ 
  let [select, setSelect] = useState('all'); 
  let [data, setData] = useState(); 
  let [copy_data, setCopy] = useState(); 
  let dispatch = useDispatch(); 
  let id = window.localStorage.getItem('id'); 
  let login_key = window.localStorage.getItem('login_key'); 
  const config = { 
    headers : { 
      'Authorization': `Bearer ${login_key}` 
    } 
  } 

  useEffect(()=>{ 
    if(data){ 
      setCopy(data.rows); 
    } 
  }, [data]); 

  useEffect(()=>{ 
    dispatch(change_page('property')); 
  }, []) 

  const fetchProperty = () => { 
    // API 호출 대신 목업 데이터로 state 설정
    console.log(mockRecordData);
    setData(mockRecordData);
  }; 

  useEffect(()=>{ 
    fetchProperty(); 
  }, []); 

  if(data){ 
    return( 
      <div className="page-container container board-page-container"> 
        <div className="page-head"> 
          <h2>게시판 관리</h2> 
        </div> 
        <div className="section board "> 
          <div className="width_con "> 
            <ul className="tabs"> 
              <li onClick={()=>{ setSelect('all'); }} className={select === 'all' ? "on" : null}> 
                <h5>전체</h5> 
                <div className="status"> 
                  <p>글 총갯수</p> 
                  <div className="counting"> 
                    <span className="whole"> 
                      {data.counts?.all?.total_count || 0} 
                    </span> 
                  </div> 
                </div> 
              </li> 
              <li onClick={()=>{setSelect('display_y');}} className={select === 'display_y' ? "on" : null}> 
                <h5>노출중</h5> 
                <div className="status"> 
                  <p>글 총갯수</p> 
                  <span className="whole"> 
                    {data.display_counts?.["1"]?.total_count || 0} 
                  </span> 
                </div> 
              </li> 
              <li onClick={()=>{setSelect('display_n');}} className={select === 'display_n' ? "on" : null}> 
                <h5>비노출</h5> 
                <div className="status"> 
                  <p>글 총갯수</p> 
                  <div className="counting"> 
                    <span className="whole"> 
                      {data.display_counts?.["2"]?.total_count || 0} 
                    </span> 
                  </div> 
                </div> 
              </li> 
              <li onClick={()=>{setSelect('status_3');}} className={select === 'status_3' ? "on" : null}> 
                <h5>거래완료</h5> 
                <div className="status"> 
                  <p>글 총갯수</p> 
                  <div className="counting"> 
                    <span className="whole"> 
                      {data.counts?.["3"]?.total_count || 0} 
                    </span> 
                  </div> 
                </div> 
              </li> 
            </ul> 
            <div className="board_con "> 
              <Property_list 
                origin_data={data} 
                data={copy_data} 
                whats={select} 
                refreshParent={fetchProperty} 
              > 
              </Property_list> 
            </div> 
          </div> 
        </div> 
      </div> 
    ) 
  } 
} 

export default Property;