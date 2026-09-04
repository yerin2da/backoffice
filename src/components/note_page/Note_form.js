import React, { useState, useEffect, useRef } from "react"; 
import ReactQuill from "react-quill"; 
import "react-quill/dist/quill.snow.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faTrashCan } from "@fortawesome/free-solid-svg-icons"; 
import { Link, useNavigate, useParams } from "react-router-dom"; 
import DaumPostcode from "react-daum-postcode"; 

/* ========================================================================== 
   1. 주소 검색 팝업 모달 컴포넌트 
   ========================================================================== */ 
function AddressSearchModal({ onComplete, onClose }) { 
  const handleComplete = (data) => { 
    let fullAddress = data.address; 
    let extraAddress = ""; 
    if (data.addressType === "R") { 
      if (data.bname !== "") extraAddress += data.bname; 
      if (data.buildingName !== "") { 
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName; 
      } 
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : ""; 
    } 
    onComplete({ 
      sido: data.sido, 
      sigungu: data.sigungu, 
      bname: data.bname, 
      roadAddress: data.roadAddress, 
      zonecode: data.zonecode, 
    }); 
  }; 

  return ( 
    <div 
      className="modal_overlay" 
      style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: "rgba(0,0,0,0.5)", 
        zIndex: 1000, 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
      }} 
    > 
      <div 
        style={{ 
          background: "#fff", 
          padding: "20px", 
          borderRadius: "8px", 
          width: "90%", 
          maxWidth: "500px", 
          position: "relative", 
        }} 
      > 
        <button 
          onClick={onClose} 
          style={{ 
            float: "right", 
            cursor: "pointer", 
            border: "none", 
            background: "none", 
            fontWeight: "bold", 
          }} 
        > 
          X 닫기 
        </button> 
        <h4 style={{ marginBottom: "15px", fontSize: "18px", fontWeight: "bold" }}> 
          주소 검색 
        </h4> 
        <DaumPostcode onComplete={handleComplete} /> 
      </div> 
    </div> 
  ); 
} 

/* ========================================================================== 
   2. 목업 데이터 (수정 모드 바인딩 및 관심제품 검색용)
   ========================================================================== */ 
const MOCK_NOTE_FORM_DATA = {
  note_no: "19",
  agent_no: "1",
  property_no: "108",
  visitor_name: "김민준",
  visitor_phone: "010-1234-5678",
  visit_type: "tenant",
  transaction_type: "sale",
  budget: "25000",
  preferred_area: "영업1팀",
  inflow_type: "web",
  status: "consulting",
  visit_date: "2026-08-01T14:00",
  next_contact_date: "2026-07-30T10:00"
};

/* ========================================================================== 
   3. 메모 등록/수정 메인 컴포넌트 (Note_form) 
   ========================================================================== */ 
function Note_form() { 
  const navigate = useNavigate(); 
  const formRef = useRef(null); 
  const { note_no } = useParams(); 
  const isEditMode = Boolean(note_no); 

  const formatNumber = (numStr) => { 
    if (numStr === null || numStr === undefined) return ""; 
    const cleanNum = numStr.toString().replace(/[^0-9]/g, ""); 
    if (!cleanNum) return ""; 
    return Number(cleanNum).toLocaleString("ko-KR"); 
  }; 

  const initialFormState = { 
    note_no: "", 
    agent_no: "", 
    property_no: "", 
    visitor_name: "", 
    visitor_phone: "", 
    visit_type: "tenant", 
    transaction_type: "sale", 
    budget: "", 
    preferred_area: "", 
    inflow_type: "visit", 
    status: "consulting", 
    visit_date: "", 
    next_contact_date: "" 
  }; 

  const [formData, setFormData] = useState(initialFormState); 
  const [isOpenPostcode, setIsOpenPostcode] = useState(false); 

  // 관심제품 선택 목업 State
  const [selectedProperty, setSelectedProperty] = useState({ 
    property_no: 108, 
    property_name: "PRD-2024-A (스마트 솔루션 패키지)" 
  }); 

  // [수정 모드] 목업 데이터 바인딩 시뮬레이션
  useEffect(() => { 
    if (!isEditMode) return; 

    const data = MOCK_NOTE_FORM_DATA; 
    setFormData({ 
      note_no: data.note_no ?? "", 
      agent_no: data.agent_no ?? "", 
      property_no: data.property_no ?? "", 
      visitor_name: data.visitor_name ?? "", 
      visitor_phone: data.visitor_phone ?? "", 
      visit_type: data.visit_type ?? "tenant", 
      transaction_type: data.transaction_type ?? "sale", 
      budget: data.budget ?? "", 
      preferred_area: data.preferred_area ?? "", 
      inflow_type: data.inflow_type ?? "visit", 
      status: data.status ?? "consulting", 
      visit_date: data.visit_date ?? "", 
      next_contact_date: data.next_contact_date ?? "", 
    }); 
  }, [note_no, isEditMode]); 

  // 입력 핸들러
  const handleChange = (e) => { 
    const { name, value } = e.target; 
    setFormData((prev) => ({ ...prev, [name]: value })); 
  }; 

  // 주소 선택 완료 핸들러
  const handleAddressComplete = (data) => { 
    setIsOpenPostcode(false); 
  }; 

  // 폼 제출 핸들러 (목업 시뮬레이션)
  const handleSubmit = () => { 
    const requiredFields = [ 
      { name: "visitor_name", label: "방문자명" }, 
      { name: "visitor_phone", label: "연락처" }, 
      { name: "visit_type", label: "방문형태" }, 
      { name: "transaction_type", label: "거래방식" }, 
      { name: "budget", label: "예산" }, 
      { name: "preferred_area", label: "희망지역" }, 
      { name: "inflow_type", label: "유입경로" }, 
      { name: "status", label: "진행상태" }, 
      { name: "visit_date", label: "방문예정일" }, 
      { name: "next_contact_date", label: "다음연락예정일" }, 
    ]; 

    for (const field of requiredFields) { 
      const value = formData[field.name]; 
      if (value === "" || value === null || value === undefined) { 
        alert(`${field.label}을(를) 입력해주세요.`); 
        formRef.current?.querySelector(`[name="${field.name}"]`)?.focus(); 
        return; 
      } 
    } 

    const actionText = isEditMode ? "수정" : "등록"; 
    if (!window.confirm(`메모 정보를 ${actionText}하시겠습니까?`)) return; 

    alert(`메모 ${actionText}이 완료되었습니다.`); 
    navigate("/note"); 
  }; 

  return ( 
    <div className="page-container container"> 
      <div className="sections write property_section"> 
        <div className=""> 
          <Link to="/note" className="back-link"> 
            ← 목록으로 
          </Link> 

          <h3>{isEditMode ? `메모 수정 (#${note_no})` : "메모 등록"}</h3> 

          <form ref={formRef} id="noteForm" onSubmit={(e) => e.preventDefault()}> 
            <div className="panel"> 
              {/* 1. 방문자 정보 섹션 */} 
              <div className="section_box"> 
                <div className="sec_title_bar"> 
                  <h4>방문자 정보</h4> 
                </div> 
                <div className="grid_row col2"> 
                  <div className="form_group"> 
                    <label> 
                      방문자명<span className="esenstial">*</span> 
                    </label> 
                    <input 
                      type="text" 
                      name="visitor_name" 
                      value={formData.visitor_name} 
                      onChange={handleChange} 
                      placeholder="예) 김민준" 
                    /> 
                  </div> 
                  <div className="form_group"> 
                    <label> 
                      연락처<span className="esenstial">*</span> 
                    </label> 
                    <input 
                      type="text" 
                      name="visitor_phone" 
                      value={formData.visitor_phone} 
                      onChange={handleChange} 
                      placeholder="010-0000-0000" 
                    /> 
                  </div> 
                </div> 

                <div className="grid_row col2"> 
                  <div className="form_group"> 
                    <label> 
                      방문형태<span className="esenstial">*</span> 
                    </label> 
                    <select 
                      name="visit_type" 
                      value={formData.visit_type} 
                      onChange={handleChange} 
                    > 
                      <option value="tenant"> 신규고객 </option> 
                      <option value="landlord"> 기존고객 </option> 
                    </select> 
                  </div> 

                  <div className="form_group"> 
                    <label> 
                      유입경로<span className="esenstial">*</span> 
                    </label> 
                    <select 
                      name="inflow_type" 
                      value={formData.inflow_type} 
                      onChange={handleChange} 
                    > 
                      <option value="visit">방문</option> 
                      <option value="phone">전화</option> 
                      <option value="web">웹신청</option> 
                      <option value="naver">검색/포털</option> 
                      <option value="referral">지인소개</option> 
                      <option value="etc">기타</option> 
                    </select> 
                  </div> 
                </div> 
              </div> 

              {/* 2. 상담 정보 섹션 */} 
              <div className="section_box"> 
                <div className="sec_title_bar"> 
                  <h4>상담 정보</h4> 
                </div> 

                <div className="grid_row col2"> 
                  <div className="form_group"> 
                    <label>거래방식<span className="esenstial">*</span></label> 
                    <select 
                      name="transaction_type" 
                      value={formData.transaction_type} 
                      onChange={handleChange} 
                    > 
                      <option value="sale">제품문의</option> 
                      <option value="jeonse">계약제휴</option> 
                      <option value="monthly">기술지원</option> 
                      <option value="etc">기타문의</option> 
                    </select> 
                  </div> 

                  <div className="form_group"> 
                    <label>예산 <span className="esenstial">*</span> <span className="opt">만원 단위</span></label> 
                    <input 
                      type="number" 
                      name="budget" 
                      value={formData.budget} 
                      onChange={handleChange} 
                      placeholder="예) 2500" 
                    /> 
                  </div> 
                </div> 

                <div className="grid_row full"> 
                  <div className="form_group"> 
                    <label>희망지역<span className="esenstial">*</span></label> 
                    <input 
                      type="text" 
                      name="preferred_area" 
                      value={formData.preferred_area} 
                      onChange={handleChange} 
                      placeholder="예) 영업1팀" 
                    /> 
                  </div> 
                </div> 

                <div className="grid_row full"> 
                  <div className="form_group"> 
                    <label>진행상태<span className="esenstial">*</span></label> 
                    <select 
                      name="status" 
                      value={formData.status} 
                      onChange={handleChange} 
                    > 
                      <option value="consult_request">상담접수</option> 
                      <option value="consulting">상담중</option> 
                      <option value="proposed">제안완료</option> 
                      <option value="contracted">완료</option> 
                      <option value="lost">이탈</option> 
                    </select> 
                  </div> 
                </div> 
              </div> 

              {/* 3. 일정 섹션 */} 
              <div className="section_box"> 
                <div className="sec_title_bar"> 
                  <h4>일정</h4> 
                </div> 

                <div className="grid_row col2"> 
                  <div className="form_group"> 
                    <label>방문예정일<span className="esenstial">*</span></label> 
                    <input 
                      type="datetime-local" 
                      name="visit_date" 
                      value={formData.visit_date} 
                      onChange={handleChange} 
                    /> 
                  </div> 

                  <div className="form_group"> 
                    <label>다음연락예정일<span className="esenstial">*</span></label> 
                    <input 
                      type="datetime-local" 
                      name="next_contact_date" 
                      value={formData.next_contact_date} 
                      onChange={handleChange} 
                    /> 
                  </div> 
                </div> 
              </div> 

              {/* 4. 배정 섹션 */} 
              <div className="section_box"> 
                <div className="sec_title_bar">
                  <h4>배정 (선택)</h4>
                </div> 

                <div className="grid_row col2"> 
                  <div className="form_group"> 
                    <label>접수자<span className="opt">(담당자)</span></label> 
                    <select 
                      name="agent_no" 
                      value={formData.agent_no} 
                      onChange={handleChange} 
                      style={{
                        flex: "none"
                      }}
                    > 
                      <option value="">미배정</option> 
                      <option value="1">홍길동 팀장</option> 
                      <option value="2">김상담 대리</option> 
                    </select> 
                  </div> 

                  <div className="form_group"> 
                    <label> 관심제품 <span className="opt">등록된 제품과 연결</span> </label> 
                    <div className="property_pick"> 
                      <input type="text" placeholder="제품명으로 검색" /> 
                      <button 
                        type="button" 
                        className="btn btn-muted search_btn" 
                        onClick={() => setSelectedProperty({ 
                          property_no: 108, 
                          property_name: "PRD-2024-A (스마트 솔루션 패키지)", 
                        })} 
                      > 
                        검색 
                      </button> 
                    </div> 

                    <input type="hidden" name="property_no" value={selectedProperty?.property_no || ""} /> 

                    {selectedProperty && ( 
                      <div className="picked_property"> 
                        <span>{selectedProperty.property_name}</span> 
                        <button 
                          type="button" 
                          onClick={() => setSelectedProperty(null)} 
                        > 
                          해제 ✕ 
                        </button> 
                      </div> 
                    )} 

                    <p className="help"> 
                      비워두면 특정 제품과 연결하지 않고 저장됩니다. 
                    </p> 
                  </div> 
                </div> 
              </div> 
            </div> 

            {/* 하단 저장 / 취소 버튼 */} 
            <div className="section_box"> 
              <div className="btn_con"> 
                <div></div> 
                <div className="right"> 
                  <div className="btn btn-primary" onClick={handleSubmit}> 
                    {isEditMode ? "저장하기" : "등록하기"} 
                  </div> 
                  <div className="btn btn-muted"> 
                    <span> 
                      <Link to="/note"> 취소 </Link> 
                    </span> 
                  </div> 
                </div> 
              </div> 
            </div> 
          </form> 
        </div> 

        {/* 주소 검색 모달 */} 
        {isOpenPostcode && ( 
          <AddressSearchModal 
            onComplete={handleAddressComplete} 
            onClose={() => setIsOpenPostcode(false)} 
          /> 
        )} 
      </div> 
    </div> 
  ); 
} 

export default Note_form;