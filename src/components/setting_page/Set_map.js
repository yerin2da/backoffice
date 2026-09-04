import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";

function Set_map() {
  const publicUrl = process.env.PUBLIC_URL || '';

  const [formData, setFormData] = useState({
    bgcolor_show: "Y",
    bgcolor: "#f5f5f5",
    transparent: "0",
    addr: "서울특별시 강남구 테헤란로 123 테크타워 5층",
    tel: "02-1234-5678",
    subway_show: "Y",
    subway: "2호선 강남역 1번 출구에서 도보 5분 (약 300m 직진)",
    bus_show: "Y",
    bus: "간선버스: 146, 341, 360 / 지선버스: 4318 (강남역 하나은행 앞 하차)",
    google: "https://maps.google.com"
  });

  const [upload_img, setUpload] = useState('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200');
  const [upload_img2, setUpload2] = useState('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "Y" : "N") : value
    }));
  };

  function preview(input, type) {
    if (input && input.length !== 0) {
      const reader = new FileReader();
      reader.onload = function (e) {
        if (type === 2) {
          setUpload2(e.target.result);
        } else {
          setUpload(e.target.result);
        }
      };
      reader.readAsDataURL(input[0]);
    }
  }

  return (
    <div className="set-map-wrapper" style={{ minHeight: '100vh', width: '100%' }}>
      <form id="mapSetting" data-whats="map">
        {/* 상단 컨트롤 타워 */}
        <section className="grid">
          <div className="card homepage-set-title-btn">
            <h3>오시는길 페이지 설정</h3>
            <div className="btn-row">
              <div 
                className="btn btn-muted" 
                onClick={() => {
                  if (window.confirm('오시는길 페이지 설정을 초기화 시키시겠습니까?')) {
                    setFormData({
                      bgcolor_show: "Y",
                      bgcolor: "#f5f5f5",
                      transparent: "0",
                      addr: "",
                      tel: "",
                      subway_show: "Y",
                      subway: "",
                      bus_show: "Y",
                      bus: "",
                      google: ""
                    });
                    setUpload('');
                    setUpload2('');
                  }
                }}
              >
                <span>초기화</span>
              </div>
              <div 
                className="btn btn-primary" 
                onClick={() => {
                  alert("성공적으로 저장되었습니다.");
                }}
              >
                <span>저장하기</span>
              </div>
            </div>
          </div>
        </section>

        {/* 배경이미지 설정 */}
        <section className="grid">
          <div className="card">
            <div className="title-checkCon">
              <h3>배경이미지 설정 (선택)</h3>
              <div className="check_con">
                <label>
                  <input
                    className="check_menu input_check"
                    name="bgcolor_show"
                    type="checkbox"
                    checked={formData.bgcolor_show === "Y"}
                    onChange={handleChange}
                  />
                  <div className="check_btn">
                    <span className="disabled">숨김</span>
                    <span className="abled">보임</span>
                    <div className="circle"></div>
                  </div>
                </label>
              </div>
            </div>
            <p className="sub">해당페이지 상단 히어로 배경 이미지를 설정해주세요.</p>
            <div className="bg_img_con">
              <label style={{ cursor: 'pointer' }}>
                <input 
                  type="file" 
                  name="file" 
                  accept="image/png, image/jpeg" 
                  style={{ display: 'none' }} 
                  onChange={(e) => preview(e.target.files, 1)} 
                />
                <div className="upload_img">
                  {upload_img === '' ? (
                    <img src={`${publicUrl}/img/basic/notice/notice_base.jpg`} alt="기본 배경 이미지" />
                  ) : (
                    <img src={upload_img} alt="배경 이미지" />
                  )}
                </div>
              </label>
              {upload_img !== '' && (
                <div className="btn-minus" onClick={() => setUpload('')}>
                  <span><FontAwesomeIcon icon={faTrashCan} /></span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 배경색 설정 */}
        <section className="grid">
          <div className="card">
            <div className="title-checkCon">
              <h3>배경색 설정 (선택)</h3>
            </div>
            <div className="background_con">
              <div className="opa_con">
                <div className="opacity_con">
                  <div className="card-content">
                    <p className="card-content-tit">배경색</p>
                    <input 
                      type="color" 
                      name="bgcolor" 
                      className="clr_input" 
                      value={formData.bgcolor} 
                      onChange={handleChange} 
                    />
                  </div>
                  <div className="card-content">
                    <p className="card-content-tit">투명도 <span>{formData.transparent}%</span></p>
                    <div className="range_con">
                      <input 
                        type="range" 
                        name="transparent" 
                        className="opacity_input" 
                        min={0} 
                        max={100} 
                        value={formData.transparent} 
                        onChange={handleChange} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 위치정보 설정 */}
        <section className="grid">
          <div className="card">
            <div className="title-checkCon">
              <h3>위치 및 오시는 길 안내 설정</h3>
            </div>
            <p className="sub">사업장 위치 및 대중교통 이용 안내 문구를 설정해주세요.</p>
            <div className="main_con">
              <ul className="lists">
                <li>
                  <div className="img_con">
                    <img src={`${publicUrl}/img/basic/map/map_address.png`} alt="위치 아이콘" />
                  </div>
                  <div className="desc_con">
                    <div className="title_con">
                      <h4>주소 및 대표 연락처<span className="esenstial">*</span></h4>
                    </div>
                    <input 
                      type="text" 
                      name="addr" 
                      placeholder="사업장 주소를 입력해주세요" 
                      value={formData.addr} 
                      onChange={handleChange} 
                    />
                    <input 
                      type="text" 
                      name="tel" 
                      placeholder="대표 연락처를 입력해주세요" 
                      value={formData.tel} 
                      onChange={handleChange} 
                    />
                  </div>
                </li>
                <li>
                  <div className="img_con">
                    <img src={`${publicUrl}/img/basic/map/map_subway.png`} alt="지하철 아이콘" />
                  </div>
                  <div className="desc_con">
                    <div className="title_con">
                      <h4>지하철 이용시 안내</h4>
                      <div className="check_con">
                        <label>
                          <input
                            className="check_menu input_check"
                            name="subway_show"
                            type="checkbox"
                            checked={formData.subway_show === "Y"}
                            onChange={handleChange}
                          />
                          <div className="check_btn">
                            <span className="disabled">숨김</span>
                            <span className="abled">보임</span>
                            <div className="circle"></div>
                          </div>
                        </label>
                      </div>
                    </div>
                    <textarea 
                      name="subway" 
                      className="subus" 
                      placeholder="주변 지하철역 안내" 
                      value={formData.subway} 
                      onChange={handleChange}
                    />
                  </div>
                </li>
                <li>
                  <div className="img_con">
                    <img src={`${publicUrl}/img/basic/map/map_bus.png`} alt="버스 아이콘" />
                  </div>
                  <div className="desc_con">
                    <div className="title_con">
                      <h4>버스 이용시 안내</h4>
                      <div className="check_con">
                        <label>
                          <input
                            className="check_menu input_check"
                            name="bus_show"
                            type="checkbox"
                            checked={formData.bus_show === "Y"}
                            onChange={handleChange}
                          />
                          <div className="check_btn">
                            <span className="disabled">숨김</span>
                            <span className="abled">보임</span>
                            <div className="circle"></div>
                          </div>
                        </label>
                      </div>
                    </div>
                    <textarea 
                      name="bus" 
                      className="subus" 
                      placeholder="주변 버스 안내" 
                      value={formData.bus} 
                      onChange={handleChange}
                    />
                  </div>
                </li>
              </ul>

              <div className="conts">
                <div className="title_con">
                  <h5>약도 / 약도 캡쳐 이미지 업로드</h5>
                </div>
                <div className="input_con img_input bg-map-con">
                  <label style={{ cursor: 'pointer' }}>
                    <input 
                      type="file" 
                      name="file2" 
                      accept="image/png, image/jpeg" 
                      style={{ display: 'none' }} 
                      onChange={(e) => preview(e.target.files, 2)} 
                    />
                    <div className="upload_img">
                      {upload_img2 === '' ? (
                        <img src={`${publicUrl}/img/basic/map/map_base.jpg`} alt="기본 약도 이미지" />
                      ) : (
                        <img src={upload_img2} alt="위치약도 이미지" />
                      )}
                    </div>
                  </label>
                  {upload_img2 !== '' && (
                    <div className="btn-minus" onClick={() => setUpload2('')}>
                      <span><FontAwesomeIcon icon={faTrashCan} /></span>
                    </div>
                  )}
                </div>

                <div className="map_link_con">
                  <img src={`${publicUrl}/img/basic/map/map_link.png`} alt="지도 링크 아이콘" />
                  <input 
                    type="text" 
                    name="google" 
                    placeholder="지도 링크를 입력하세요" 
                    value={formData.google} 
                    onChange={handleChange} 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}

export default Set_map;