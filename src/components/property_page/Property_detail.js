import React, { useEffect, useState } from "react"; 
import { Link, useParams, useNavigate } from "react-router-dom"; 
import ReactQuill from "react-quill"; 
import "react-quill/dist/quill.snow.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faTrashCan } from "@fortawesome/free-solid-svg-icons"; 
import { useSelector } from "react-redux"; 

// API 호출을 대체할 목업 상세 데이터
const MOCK_DETAIL_DATA = {
  property_no: "101",
  property_type_txt: "전자기기",
  transaction_type_txt: "일반",
  status_txt: "거래가능",
  display_yn_txt: "노출",
  property_name: "고성능 게이밍 노트북 팝니다",
  building_name: "테크노타워 A동",
  addr_sido: "서울특별시",
  addr_sigungu: "강남구",
  addr_dong: "역삼동",
  lat: "37.4979",
  lng: "127.0276",
  addr_road: "서울특별시 강남구 테헤란로 123",
  supply_area: "0",
  exclusive_area: "0",
  total_floor: "1",
  current_floor: "1",
  room_count: 0,
  bathroom_count: 0,
  parking_available: "N",
  parking_count: 0,
  completion_date: "2025-01-15",
  move_in_date: "즉시가능",
  direction_txt: "-",
  heating_fuel_txt: "-",
  heating_type_txt: "-",
  sale_price: 150000,
  jeonse_price: 0,
  deposit_price: 0,
  monthly_rent: 0,
  loan_amount: 0,
  maintenance_fee: 0,
  summary: "최신 사양 미개봉급 게이밍 노트북 급매합니다.",
  description: "<p>상태 최상이며, 풀박스 구성입니다.</p><p>직거래 및 택배 거래 모두 가능합니다.</p>",
  main_image_url: "https://via.placeholder.com/400x300?text=Main+Image",
  detail_images: [
    { full_url: "https://via.placeholder.com/200x150?text=Detail+1" },
    { full_url: "https://via.placeholder.com/200x150?text=Detail+2" }
  ]
};

function Property_detail() { 
  const { property_no } = useParams(); 
  const navigate = useNavigate(); 
  const [data, setData] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const login_key = window.localStorage.getItem('login_key'); 
  const config = { 
    headers: { 
      'Authorization': `Bearer ${login_key}` 
    } 
  }; 
  let url = `${process.env.REACT_APP_API_KEY}Admin/Property/detail?property_no=${property_no}`; 
  const [mapImage, setMapImage] = useState(""); 

  // 금액 표시 함수 (만원 → 억/만원) 
  const formatPrice = (price) => { 
    if (!price || Number(price) === 0) return "-"; 
    const num = Number(price); 
    const eok = Math.floor(num / 10000); 
    const man = num % 10000; 
    if (eok > 0 && man > 0) { 
      return `${eok}억 ${man.toLocaleString()}만원`; 
    } 
    if (eok > 0) { 
      return `${eok}억`; 
    } 
    return `${num.toLocaleString()}만원`; 
  }; 

  // 게시글 삭제
  const handleDelete = () => { 
    if (!window.confirm("삭제하시겠습니까?")) return; 
    
    // axios.post 대체
    console.log("목업 삭제 처리:", data.property_no);
    alert("삭제되었습니다."); 
    navigate('/property'); 
  }; 

  // 목업 데이터 세팅
  useEffect(() => { 
    // axios.get 대체
    setTimeout(() => {
      const mockData = { ...MOCK_DETAIL_DATA, property_no: property_no || "101" };
      console.log("상세 데이터:", mockData); 
      setData(mockData); 
      
      if (mockData.lat && mockData.lng) { 
        setMapImage("https://via.placeholder.com/600x200?text=Map+Preview"); 
      }
      setLoading(false);
    }, 100);
  }, [property_no]); 

  if(loading){ 
    return ( 
      <div className="sections view property_view"> 
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
          <Link to="/property" className="back-link"> 
            ← 목록으로 
          </Link> 
          <div className="panel"> 
            <div className="panel-body"> 
              {/* 1. 기본정보 */} 
              <div className="section_box"> 
                <div className="sec_title_bar"> 
                  <h4>기본정보</h4> 
                  <span className="code-text">[매물코드: {property_no}]</span> 
                </div> 
                <div className="info-grid"> 
                  <div className="info-item"> 
                    <span className="info-label">매물종류</span> 
                    <span className="info-value">{data.property_type_txt || "-"}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">거래방식</span> 
                    <span className="info-value">{data.transaction_type_txt || "-"}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">거래상태</span> 
                    <span className="info-value">{data.status_txt || "-"}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">노출여부</span> 
                    <span className="info-value">{data.display_yn_txt}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">매물명</span> 
                    <span className="info-value">{data.property_name || "-"}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">건물명</span> 
                    <span className="info-value">{data.building_name || "-"}</span> 
                  </div> 
                </div> 
              </div> 

              {/* 2. 위치정보 */} 
              <div className="section_box"> 
                <div className="sec_title_bar"> 
                  <h4>위치정보</h4> 
                </div> 
                <div className="info-grid"> 
                  <div className="info-item"> 
                    <span className="info-label">주소(시도)</span> 
                    <span className="info-value">{data.addr_sido || "-"}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">주소(시군구)</span> 
                    <span className="info-value">{data.addr_sigungu || "-"}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">주소(읍면동)</span> 
                    <span className="info-value">{data.addr_dong || "-"}</span> 
                  </div> 
                  <div className="info-item display_none" > 
                    <span className="info-label">좌표 정보</span> 
                    <span className="info-value">{data.lat && data.lng ? `위도: ${data.lat} / 경도: ${data.lng}` : "-"}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">도로명주소</span> 
                    <span className="info-value">{data.addr_road || "-"}</span> 
                  </div> 
                  <div className="info-item full"> 
                    <span className="info-label">지도 위치</span> 
                    <span className="info-value"> 
                      {mapImage && ( 
                        <div className="map_preview" style={{ marginTop: "0px" }}> 
                          <img src={mapImage} alt="지도 위치" /> 
                        </div> 
                      )} 
                    </span> 
                  </div> 
                </div> 
              </div> 

              {/* 3. 매물 정보 */} 
              <div className="section_box"> 
                <div className="sec_title_bar"> 
                  <h4>매물 정보</h4> 
                </div> 
                <div className="info-grid"> 
                  <div className="info-item"> 
                    <span className="info-label">공급면적</span> 
                    <span className="info-value">{data.supply_area ? `${data.supply_area} ㎡` : "-"}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">전용면적</span> 
                    <span className="info-value">{data.exclusive_area ? `${data.exclusive_area} ㎡` : "-"}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">총 층수</span> 
                    <span className="info-value">{data.total_floor ? `${data.total_floor}층` : "-"}</span> 
                  </div> 
                  <div className="info-item" > 
                    <span className="info-label">해당 층</span> 
                    <span className="info-value">{data.current_floor ? `${data.current_floor}층` : "-"}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">방수</span> 
                    <span className="info-value">{data.room_count || 0}개</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">욕실수</span> 
                    <span className="info-value">{data.bathroom_count || 0}개</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">주차 가능</span> 
                    <span className="info-value">{data.parking_available === "Y" ? `${data.parking_count || 0}대` : "불가"}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">준공일</span> 
                    <span className="info-value">{data.completion_date || "-"}</span> 
                  </div> 
                  <div className="info-item" > 
                    <span className="info-label">입주가능일</span> 
                    <span className="info-value">{data.move_in_date || "-"}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">방향</span> 
                    <span className="info-value">{data.direction_txt || "-"}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">난방연료</span> 
                    <span className="info-value">{data.heating_fuel_txt || "-"}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">난방방식</span> 
                    <span className="info-value">{data.heating_type_txt || "-"}</span> 
                  </div> 
                </div> 
              </div> 

              {/* 4. 가격 및 소개 */} 
              <div className="section_box"> 
                <div className="sec_title_bar"> 
                  <h4>가격 및 소개</h4> 
                </div> 
                <div className="info-grid"> 
                  <div className="info-item"> 
                    <span className="info-label">매매가</span> 
                    <span className="info-value">{formatPrice(data.sale_price)}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">전세가</span> 
                    <span className="info-value">{formatPrice(data.jeonse_price)}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">보증금</span> 
                    <span className="info-value">{formatPrice(data.deposit_price)}</span> 
                  </div> 
                  <div className="info-item" > 
                    <span className="info-label">월세</span> 
                    <span className="info-value">{formatPrice(data.monthly_rent)}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">융자금</span> 
                    <span className="info-value">{formatPrice(data.loan_amount)}</span> 
                  </div> 
                  <div className="info-item"> 
                    <span className="info-label">관리비</span> 
                    <span className="info-value"> 
                      {data.maintenance_fee ? `${Number(data.maintenance_fee).toLocaleString()}만원` : "-" } 
                    </span> 
                  </div> 
                  <div className="info-item full"> 
                    <span className="info-label">한줄소개</span> 
                    <span className="info-value">{data.summary || "-"}</span> 
                  </div> 
                  <div className="info-item full"> 
                    <span className="info-label">상세설명</span> 
                    <div className="info-value" dangerouslySetInnerHTML={{ __html: data.description || "등록된 상세설명이 없습니다." }} /> 
                  </div> 
                </div> 
              </div> 

              {/* 5. 사진 정보 */} 
              <div className="section_box"> 
                <div className="sec_title_bar"> 
                  <h4>사진 정보</h4> 
                </div> 
                <div className="info-grid"> 
                  <div className="image_upload_container info-item"> 
                    {/* 대표 이미지 */} 
                    <p className="info-label">대표 이미지</p> 
                    {data.main_image_url ? ( 
                      <div className="upload_img_item"> 
                        <img src={data.main_image_url} alt="대표 이미지" /> 
                      </div> 
                    ) : ( 
                      <p className="no_img">등록된 대표 사진이 없습니다.</p> 
                    )} 
                  </div> 
                  {/* 상세 이미지 목록 */} 
                  <div className="detail_upload_area info-item"> 
                    <p className="info-label">추가 이미지</p> 
                    <div className="detail_grid"> 
                      {data.detail_images && data.detail_images.length > 0 ? ( 
                        data.detail_images.map((img, idx) => ( 
                          <div className="upload_img_item" key={idx}> 
                            <img src={img.full_url} alt={`상세 이미지 ${idx + 1}`} /> 
                          </div> 
                        )) 
                      ) : ( 
                        <p className="no_img">등록된 추가 사진이 없습니다.</p> 
                      )} 
                    </div> 
                  </div> 
                </div> 
              </div> 

              {/* 하단 버튼 바 */} 
              <div className="section_box"> 
                <div className="btn_con"> 
                  <div className="btn btn_del" onClick={handleDelete} > 
                    매물삭제 
                  </div> 
                  <div className="right"> 
                    <Link className="btn btn-primary" to={`/property/edit/${data.property_no}`} > 
                      수정하기 
                    </Link> 
                    <Link to="/property" className="btn btn-muted"> 
                      목록 
                    </Link> 
                  </div> 
                </div> 
              </div> 
            </div> 
          </div> 
        </div> 
      </div> 
    </div> 
  ); 
} 

export default Property_detail;