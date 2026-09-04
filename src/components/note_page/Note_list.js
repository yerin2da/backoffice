import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { change_page } from '../../store';
import { Link } from 'react-router-dom';
import { MessageSquare, ChevronRight } from "lucide-react";
import './note.css';
import '../board.css';
import axios from "axios";

// ---- 목업 데이터  ----
const MOCK_NOTE_LIST = [
  {
    num: 10,
    note_no: 101,
    visit_type: "tenant", // 클래스 스타일 유지를 위해 키값 유지
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
];

function Note_list(props){
  let [now_data, setNow_data] = useState([]);
  let [now_page, setNow_page] = useState(1);
  let [page_info, setPage_info] = useState();

  // 검색 필터 State
  const [visitType, setVisitType] = useState('all');
  const [transaction_type, setTransaction_type] = useState('all');
  const [visitorName, setVisitorName] = useState('');
  const [phoneTxt, setPhoneTxt] = useState('');

  // 메모 모달 팝업 State
  const [memoModalData, setMemoModalData] = useState(null); // 선택된 note 객체
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMemoText, setNewMemoText] = useState('');

  let login_key = window.localStorage.getItem('login_key');
  const config = {
    headers : {
      'Authorization': `Bearer ${login_key}`
    }
  };

  // API 데이터 조회 함수 (목업 데이터 연동)
  const fetchData = useCallback((page = now_page) => {
    // 목업 데이터 필터링 적용
    let filtered = [...MOCK_NOTE_LIST];

    if (props.whats && props.whats !== 'all') {
      filtered = filtered.filter(item => item.status === props.whats);
    }
    if (visitType && visitType !== 'all') {
      filtered = filtered.filter(item => item.visit_type === visitType);
    }
    if (transaction_type && transaction_type !== 'all') {
      filtered = filtered.filter(item => item.transaction_type_txt.includes(transaction_type));
    }
    if (visitorName.trim()) {
      filtered = filtered.filter(item => item.visitor_name.includes(visitorName.trim()));
    }
    if (phoneTxt.trim()) {
      filtered = filtered.filter(item => item.visitor_phone.includes(phoneTxt.trim()));
    }

    setNow_data(filtered);

    if (memoModalData) {
      const updateMemoData = filtered.find(item => item.note_no === memoModalData.note_no);
      if (updateMemoData) {
        setMemoModalData(updateMemoData);
      }
    }

    setPage_info({
      total_page: 1,
      current_page: page,
      total_count: filtered.length
    });
  }, [memoModalData, now_page, visitType, transaction_type, visitorName, phoneTxt, props.whats]);

  // 페이지 이동 및 상태 탭 변경 시 데이터 로드
  useEffect(()=>{
    setNow_page(1);
    // fetchData(1);
  }, [props.whats]);

  // 페이지 이동
  useEffect(()=>{
    fetchData(now_page);
  }, [now_page, props.whats]);

  // 검색 실행
  const handleSearch = () => {
    if (now_page === 1) {
      fetchData(1);
    } else {
      setNow_page(1); // useEffect에 의해 자동 실행
    }
  };

  // 검색 초기화
  const handleReset = () => {
    setVisitType('all');
    setTransaction_type('all');
    setVisitorName('');
    setPhoneTxt('');
  };

  // 상태 탭 클릭 이벤트
  const handleStatusClick = (statusKey) => {
    setNow_page(1);
  };

  // 메모 팝업 열기
  const handleOpenMemoModal = (note) => {
    setMemoModalData(note);
    setNewMemoText('');
    setIsModalOpen(true);
  };

  // 메모 팝업 닫기
  const handleCloseMemoModal = () => {
    setIsModalOpen(false);
    setMemoModalData(null);
  };

  // 신규 메모 등록
  const handleMemoSubmit = (e) => {
    e.preventDefault();
    if (!newMemoText.trim() || !memoModalData) return;

    // 목업 메모 업데이트 처리
    const updatedMemos = [
      ...(memoModalData.memos || []),
      {
        memo_no: Date.now(),
        name: "관리자",
        memo: newMemoText.trim()
      }
    ];

    const updatedNote = { ...memoModalData, memos: updatedMemos };
    setMemoModalData(updatedNote);

    // 전체 리스트 데이터 갱신 반영
    setNow_data(prev => prev.map(item => item.note_no === updatedNote.note_no ? updatedNote : item));
    alert("메모가 등록되었습니다.");
    setNewMemoText("");
  };

  // 페이지네이션 관련
  let page = [];
  if(page_info){
    for(let i = 0; i < page_info.total_page; i++){
      page.push('');
    }
  }

  return (
    <div className="brd all_brd">
      {/* ---- 검색 툴바 영역 ---- */}
      <div className="toolbar">
        <div className="toolbar-search">
          <select className="text-input" value={visitType} onChange={(e) => setVisitType(e.target.value)}>
            <option value="all">고객구분</option>
            <option value="tenant">신규고객</option>
            <option value="landlord">기존고객</option>
          </select>

          <select className="text-input" value={transaction_type} onChange={(e) => setTransaction_type(e.target.value)}>
            <option value="all">문의유형</option>
            <option value="제품문의">제품문의</option>
            <option value="계약제휴">계약제휴</option>
            <option value="기술지원">기술지원</option>
          </select>

          <input 
            type="text" 
            className="text-input" 
            placeholder="고객명" 
            value={visitorName} 
            onChange={(e) => setVisitorName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />

          <input 
            type="text" 
            className="text-input" 
            placeholder="연락처" 
            value={phoneTxt} 
            onChange={(e) => setPhoneTxt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />

          <div className="toolbar-actions">
            <div className="btn btn-muted" onClick={handleSearch}>
              검색
            </div>
            <div className="btn btn-muted" onClick={handleReset}>
              초기화
            </div>
          </div>

          <div className="toolbar-register">
            <span><Link to="/note/write" className="btn btn-primary">노트 등록</Link></span>
          </div>
        </div>
      </div>

      {/* ---- 리스트 테이블 영역 ---- */}
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>글번호</th>
              <th>고객구분</th>
              <th>고객명</th>
              <th>문의유형</th>
              <th>관심상품</th>
              <th>담당부서</th>
              <th>상태</th>
              <th>메모</th>
              <th>방문예정일</th>
              <th>등록일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {now_data && now_data.length > 0 ? (
              now_data.map((item, i) => 
                <Rows 
                  key={item.note_no || i} 
                  cfg={config}
                  data={item} 
                  page_data={page_info}
                  onOpenMemo={() => handleOpenMemoModal(item)}
                  refreshData={fetchData}
                  refreshParent={props.refreshParent}
                />
              )
            ) : (
              <tr>
                <td colSpan="11">
                  조회된 데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---- 페이지네이션 ---- */}
      <ul className='pagenation note_pagenation'>
        {page.map((_, i) => (
          <li className={now_page === i + 1 ? 'on' : ''} key={i} onClick={() => setNow_page(i + 1)}>
            <span>{i + 1}</span>
          </li>
        ))}
      </ul>

      {/* ---- 메모 레이어 팝업 (Modal) ---- */}
      {isModalOpen && memoModalData && (
        <div 
          className="modal-overlay open" 
          onClick={(e) => e.target === e.currentTarget && handleCloseMemoModal()}
        >
          <div className="memo-modal">
            <div className="memo-modal-head">
              <div>
                <h2>{memoModalData.visitor_name}</h2>
                <div className="phone">{memoModalData.visitor_phone || '-'}</div>
              </div>
              <div className="head-actions">
                <Link className="detail-link" to={`/note/view/${memoModalData.note_no}`}>
                  상세보기 <ChevronRight size={15} color="#3182f6" />
                </Link>
                <button className="memo-modal-close" type="button" onClick={handleCloseMemoModal}>
                  ✕
                </button>
              </div>
            </div>

            <div className="memo-modal-body">
              {memoModalData.memos && memoModalData.memos.length > 0 ? (
                memoModalData.memos.map((m) => (
                  <div className="memo-item" key={m.memo_no}>
                    <div className="memo-avatar">{m.name || "-"}</div>
                    <div className="memo-bubble">
                      <div className="memo-byline">
                        <span className="memo-writer">{m.name}</span>
                      </div>
                      {m.memo}
                    </div>
                  </div>
                ))
              ) : (
                <p className="memo-empty">아직 등록된 메모가 없습니다.</p>
              )}
            </div>

            <form className="memo-modal-form" onSubmit={handleMemoSubmit}>
              <textarea 
                placeholder="메모를 입력하세요" 
                required 
                value={newMemoText}
                onChange={(e) => setNewMemoText(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">등록</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Rows(props){
  let dispatch = useDispatch();
  const data = props.data;

  const status_class = {
    consult_request: 'tag-consult_request',
    consulting: 'tag-consulting',
    proposed: 'tag-proposed',
    contracted: 'tag-contracted',
    lost: 'tag-lost'
  };

  const visit_type_class = {
    tenant: 'tag-tenant',
    landlord: 'tag-landlord'
  };

  if(!data) return null;

  return (
    <tr className={data.display_yn === "N" ? "deleted" : ""}>
      <td>{data.num}</td>
      <td>
        <span className={`tag ${visit_type_class[data.visit_type]}`}>
          {data.visit_type_txt}
        </span>
      </td>
      <td className="col-visitor">
        <Link to={`/note/view/${data.note_no}`}>
          {data.visitor_name}
          <span className="phone">{data.visitor_phone}</span>
        </Link>
      </td>
      <td>{data.transaction_type_txt}</td>
      <td className="col-area">{data.property_no}</td>
      <td className="col-area">{data.preferred_area}</td>
      <td>
        <span className={`tag ${status_class[data.status]}`}>
          {data.status_txt ? data.status_txt : '-'}
        </span>
      </td>
      <td>
        <button className="memo-count" onClick={props.onOpenMemo}>
          <MessageSquare size={16} />
          {data.memos?.length || 0}
        </button>
      </td>
      <td className="col-date">{data.visit_date}</td>
      <td className="col-date">{data.updated_at}</td>
      <td>
        <div className="row-actions">
          <Link className="btn btn-muted" to={`/note/edit/${data.note_no}`}>
            수정
          </Link>
          <div 
            className="btn btn_del" 
            onClick={() => {
              if (window.confirm("삭제하시겠습니까?")) {
                alert("삭제되었습니다.");
                props.refreshData();
                if(props.refreshParent) props.refreshParent();
              }
            }}
          >
            삭제
          </div>
        </div>
      </td>
    </tr>
  );
}

export default Note_list;