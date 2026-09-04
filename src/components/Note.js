import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { change_page, minus_list, plus_list } from "../store";
import Note_list from './note_page/Note_list';
import axios from "axios";
import './board_page/brd.css';
import './board.css';

// ---- 목업 데이터 (부동산 내용 제거 버전) ----
const MOCK_NOTE_PARENT_DATA = {
  counts: {
    all: { total_count: 10 },
    consulting: { total_count: 4 },
    proposed: { total_count: 3 },
    contracted: { total_count: 2 },
    lost: { total_count: 1 }
  },
  rows: [
    {
      num: 10,
      note_no: 101,
      visit_type: "tenant",
      visit_type_txt: "신규고객",
      visitor_name: "김민준",
      visitor_phone: "010-1234-5678",
      transaction_type_txt: "제품문의",
      property_no: "PRD-2024-A",
      preferred_area: "영업1팀",
      status: "consult_request",
      status_txt: "상담요청",
      visit_date: "2026-03-05",
      updated_at: "2026-03-01",
      display_yn: "Y",
      memos: [
        { memo_no: 1, name: "관리자", memo: "1차 전화 상담 완료. 이메일 자료 발송 예정." },
        { memo_no: 2, name: "김민준", memo: "추가 견적서 전달 요청 받음." }
      ]
    },
    {
      num: 9,
      note_no: 102,
      visit_type: "landlord",
      visit_type_txt: "기존고객",
      visitor_name: "이서연",
      visitor_phone: "010-9876-5432",
      transaction_type_txt: "계약제휴",
      property_no: "PRD-2024-B",
      preferred_area: "영업2팀",
      status: "consulting",
      status_txt: "상담중",
      visit_date: "2026-03-03",
      updated_at: "2026-02-28",
      display_yn: "Y",
      memos: [
        { memo_no: 3, name: "박담당", memo: "방문 미팅 일정 확정 (오후 2시)." }
      ]
    },
    {
      num: 8,
      note_no: 103,
      visit_type: "tenant",
      visit_type_txt: "신규고객",
      visitor_name: "박도현",
      visitor_phone: "010-5555-4321",
      transaction_type_txt: "기술지원",
      property_no: "PRD-2024-C",
      preferred_area: "CS팀",
      status: "proposed",
      status_txt: "제안완료",
      visit_date: "2026-03-02",
      updated_at: "2026-02-27",
      display_yn: "Y",
      memos: []
    },
    {
      num: 7,
      note_no: 104,
      visit_type: "landlord",
      visit_type_txt: "기존고객",
      visitor_name: "최수아",
      visitor_phone: "010-3333-7777",
      transaction_type_txt: "기타문의",
      property_no: "PRD-2024-D",
      preferred_area: "기획팀",
      status: "contracted",
      status_txt: "완료",
      visit_date: "2026-02-25",
      updated_at: "2026-02-25",
      display_yn: "Y",
      memos: [
        { memo_no: 4, name: "최수아", memo: "최종 확정 처리 완료되었습니다." }
      ]
    }
  ]
};

function Note(){
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
    dispatch(change_page('note'));
  }, [])

  // 데이터 조회 함수 (목업 데이터 전달)
  const fetchProperty = () => {
    setData(MOCK_NOTE_PARENT_DATA);
  };

  useEffect(()=>{
    fetchProperty();
  }, []);

  if(data){
    return(
      <div className="page-container container board-page-container">
        <div className="page-head">
          <h2>노트 관리</h2>
        </div>
        
        <div className="section board ">
          <div className="width_con ">
            <ul className="tabs">
              <li 
                onClick={()=>{ setSelect('all'); }} 
                className={select === 'all' ? "on" : null}
              >
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

              <li 
                onClick={()=>{ setSelect('consulting'); }} 
                className={select === 'consulting' ? "on" : null}
              >
                <h5>상담중</h5>
                <div className="status">
                  <p>글 총갯수</p>
                  <div className="counting">
                    <span className="whole">
                      {data.counts?.consulting?.total_count || 0}
                    </span>
                  </div>
                </div>
              </li>

              <li 
                onClick={()=>{ setSelect('proposed'); }} 
                className={select === 'proposed' ? "on" : null}
              >
                <h5>제안완료</h5>
                <div className="status">
                  <p>글 총갯수</p>
                  <div className="counting">
                    <span className="whole">
                      {data.counts?.proposed?.total_count || 0}
                    </span>
                  </div>
                </div>
              </li>

              <li 
                onClick={()=>{ setSelect('contracted'); }} 
                className={select === 'contracted' ? "on" : null}
              >
                <h5>계약완료</h5>
                <div className="status">
                  <p>글 총갯수</p>
                  <div className="counting">
                    <span className="whole">
                      {data.counts?.contracted?.total_count || 0}
                    </span>
                  </div>
                </div>
              </li>

              <li 
                onClick={()=>{ setSelect('lost'); }} 
                className={select === 'lost' ? "on" : null}
              >
                <h5>이탈</h5>
                <div className="status">
                  <p>글 총갯수</p>
                  <div className="counting">
                    <span className="whole">
                      {data.counts?.lost?.total_count || 0}
                    </span>
                  </div>
                </div>
              </li>
            </ul>

            <div className="board_con">
              <Note_list 
                origin_data={data} 
                data={copy_data} 
                whats={select} 
                refreshParent={fetchProperty}
              >
              </Note_list>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Note;