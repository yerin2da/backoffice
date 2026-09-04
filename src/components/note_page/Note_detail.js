import React, { useEffect, useState } from "react"; 
import { Link, useParams, useNavigate } from "react-router-dom"; 
import ReactQuill from "react-quill"; 
import "react-quill/dist/quill.snow.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faTrashCan } from "@fortawesome/free-solid-svg-icons"; 
import { Pencil, SquarePen, Edit3 } from "lucide-react"; 
import { useSelector } from "react-redux";

// 💡 퍼블리싱 및 프론트 전용 목업 데이터 (부동산 용어 제거 및 범용 비즈니스 데이터로 수정)
const MOCK_DATA = {
  note_no: "19",
  status: "consulting",
  status_txt: "상담중",
  visit_type: "tenant",
  visit_type_txt: "신규고객",
  visitor_name: "김민준",
  visitor_phone: "010-1234-5678",
  created_at: "2026-07-27 13:23:13",
  transaction_type_txt: "제품문의",
  budget: "500",
  preferred_area: "영업1팀",
  property_name: "PRD-2024-A (스마트 솔루션 패키지)",
  inflow_type_txt: "웹사이트 문의",
  agent_name: "홍길동 팀장",
  visit_date: "2026-08-01",
  next_contact_date: "2026-07-30",
  memos: [
    {
      memo_no: 1,
      name: "관리자",
      memo: "1차 전화 상담 완료. 이메일로 제품 제안서 전달함.",
      write_date: "2026-07-27 14:00:00"
    },
    {
      memo_no: 2,
      name: "김민준",
      memo: "추가 견적서 및 세부 기능 명세서 요청받음.",
      write_date: "2026-07-27 15:30:00"
    }
  ]
};

function Note_detail() { 
  const { note_no } = useParams(); 
  const navigate = useNavigate(); 
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [memoText, setMemoText] = useState(""); 
  
  // 메모 수정 state 
  const [editMemoNo, setEditMemoNo] = useState(null); 
  const [editMemoText, setEditMemoText] = useState(""); 

  // 목업 데이터 로딩 시뮬레이션
  useEffect(() => { 
    setData(MOCK_DATA);
    setLoading(false);
  }, [note_no]); 

  // 뱃지 및 태그 매핑 객체 
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

  // 메모 등록 (목업 State 업데이트)
  const handleMemoSubmit = (e) => { 
    e.preventDefault(); 
    if (!memoText.trim()) { 
      alert("메모를 입력해주세요."); 
      return; 
    } 

    const newMemo = {
      memo_no: Date.now(),
      name: "관리자",
      memo: memoText,
      write_date: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    setData(prev => ({
      ...prev,
      memos: [...(prev.memos || []), newMemo]
    }));

    alert("메모가 등록되었습니다."); 
    setMemoText(""); 
  }; 

  // 메모 수정 준비
  const handleMemoEdit = (memo) => { 
    setEditMemoNo(memo.memo_no); 
    setEditMemoText(memo.memo); 
  }; 

  // 노트 삭제 (목업 이동)
  const handleDelete = () => { 
    if (!window.confirm("삭제하시겠습니까?")) return; 
    alert("삭제되었습니다."); 
    navigate('/note'); 
  }; 

  // 메모 수정 저장 (목업 State 업데이트)
  const handleMemoUpdate = (e) => { 
    e.preventDefault(); 
    if (!editMemoText.trim()) {
      alert("수정할 메모 내용을 입력해주세요.");
      return;
    }

    setData(prev => ({
      ...prev,
      memos: prev.memos.map(m => m.memo_no === editMemoNo ? { ...m, memo: editMemoText } : m)
    }));

    alert("수정되었습니다."); 
    setEditMemoNo(null); 
    setEditMemoText(""); 
  }; 

  if(loading || !data){ 
    return ( 
      <div className="sections view note_view"> 
        <div className="width_con"> 
          <div className="loading_box" style={{ padding: '100px 0', textAlign: 'center' }}> 
            <p>데이터를 불러오는 중입니다...</p> 
          </div> 
        </div> 
      </div> 
    ); 
  } 

  return ( 
    <div className="page-container container"> 
      <div className="sections write property_section detail_section"> 
        <div className=""> 
          <Link to="/note" className="back-link"> 
            ← 목록으로 
          </Link> 

          <div className="panel"> 
            {/* 기본 정보, 상단 히어로 헤더 (상태 배지, 이름, 삭제/수정 버튼) */} 
            <div className="section_box"> 
              <div className="panel-hero"> 
                <div className="hero-left"> 
                  <div className="badge-group"> 
                    <div> 
                      <span className={`tag ${status_class[data.status]}`}> 
                        {data.status_txt || "-"} 
                      </span> 
                    </div> 
                    <div> 
                      <span className={`tag ${visit_type_class[data.visit_type]}`}> 
                        {data.visit_type_txt || "-"} 
                      </span> 
                    </div> 
                  </div> 
                  <div className="user-info-title"> 
                    {data.visitor_name || "-"} 
                    <span className="user-sub-text">| {data.visitor_phone || "-"}</span> 
                  </div> 
                </div> 

                <div className="hero-right"> 
                  <span className="sub">{data.created_at || "-"}</span> 
                </div> 
              </div> 
            </div> 

            <div className="section_box"> 
              <div className="panel-body"> 
                <div className="info-grid"> 
                  <div className="info-item"> 
                    <span className="info-label">거래방식</span> 
                    <span className="info-value">{data.transaction_type_txt || "-"}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">예산</span> 
                    <span className="info-value"> 
                      {data.budget ? `${Number(data.budget).toLocaleString()}만원` : "-" } 
                    </span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">희망지역</span> 
                    <span className="info-value">{data.preferred_area || "-"}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">관심제품</span> 
                    <span className="info-value">{data.property_name || "-"}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">유입경로</span> 
                    <span className="info-value">{data.inflow_type_txt || "-"}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">접수자</span> 
                    <span className="info-value">{data.agent_name || "미배정"}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">방문예정일</span> 
                    <span className="info-value">{data.visit_date || "-"}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">다음연락예정일</span> 
                    <span className="info-value">{data.next_contact_date || "-"}</span> 
                  </div> 
                </div> 
              </div> 
            </div> 

            {/* 하단 버튼 바 */} 
            <div className="section_box"> 
              <div className="btn_con"> 
                <div className="btn btn_del" onClick={handleDelete} > 
                  노트삭제 
                </div> 
                <div className="right"> 
                  <Link className="btn btn-primary" to={`/note/edit/${data.note_no}`} > 
                    수정하기 
                  </Link> 
                  <Link to="/note" className="btn btn-muted"> 
                    목록 
                  </Link> 
                </div> 
              </div> 
            </div> 
          </div> 

          {/* 메모 */} 
          <div className="panel"> 
            <div className="section_box"> 
              {/* 상담 메모 */} 
              <div className="memo-wrap"> 
                <h2>상담 메모 ({data.memos?.length || 0})</h2> 
                <div className="memo-thread"> 
                  { data.memos && data.memos.length > 0 ? ( 
                    data.memos.map((m)=>( 
                      <div className="memo-item" key={m.memo_no}> 
                        <div className="memo-avatar">{m.name ? m.name.slice(0,2) : "-"}</div> 
                        <div className="memo-body"> 
                          <div className="memo-bubble"> 
                            <div className="memo-byline"> 
                              <span className="memo-writer"> {m.name || "-"}</span> 
                              {editMemoNo !== m.memo_no && ( 
                                <button type="button" onClick={() => handleMemoEdit(m)} > 
                                  <Pencil size={11.5}/> 수정 
                                </button> 
                              ) } 
                            </div> 
                            {/* 메모 수정 모드일 때 */} 
                            { editMemoNo === m.memo_no ? ( 
                              <form onSubmit={handleMemoUpdate}> 
                                <textarea value={editMemoText} onChange={(e)=>setEditMemoText(e.target.value)} /> 
                                <div className="memo-edit-actions"> 
                                  <button type="submit">저장</button> 
                                  <button type="button" onClick={()=>{ setEditMemoNo(null); setEditMemoText(""); }} > 
                                    취소 
                                  </button> 
                                </div> 
                              </form> 
                            ) : ( 
                              m.memo 
                            ) } 
                          </div> 
                        </div> 
                      </div> 
                    )) 
                  ) : ( 
                    <p className="memo-empty"> 아직 등록된 메모가 없습니다. </p> 
                  ) } 
                </div> 

                <form className="memo-form" onSubmit={handleMemoSubmit} > 
                  <textarea placeholder="메모를 입력하세요" value={memoText} onChange={(e)=>setMemoText(e.target.value)} /> 
                  <button className="btn btn-primary" type="submit" > 
                    등록 
                  </button> 
                </form> 
              </div> 
            </div> 
          </div> 
        </div> 
      </div> 
    </div> 
  ); 
} 

export default Note_detail;