import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { minus_Mslide, plus_Mslide } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function Set_main() {
  let dispatch = useDispatch();
  let [mainSetting, setMainSetting] = useState();
  let [contents, setContents] = useState("");
  let store = useSelector((state) => { return state });
  let main_slide = store.set_main_slide;

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'align': [] }],
        ['bold', 'italic', 'underline', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, 'link'],
        [{
          'color': [
            '#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff',
            '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff',
            '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff',
            '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2',
            '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466'
          ]
        }, { 'background': [] }],
        ['clean']
      ],
    }
  };

  useEffect(() => {
    if (mainSetting) {
      setContents(mainSetting.row.title);
      dispatch(plus_Mslide(mainSetting.img));
    }
  }, [mainSetting]);

  // 목업 데이터 로드
  useEffect(() => {
    const mockData = {
      RECORD: {
        row: {
          title: "<h2>프리미엄 공간 & 서비스에 오신 것을 환영합니다</h2><p>최상의 서비스와 현대적인 감성을 전달합니다.</p>",
          bgcolor_show: "Y",
          bgcolor: "#000000",
          transparent: "50",
          title_show: "Y"
        },
       img: [
        { img_no: 1, full_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800" },
        { img_no: 2, full_url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800" }
      ]
      }
    };

    setMainSetting(mockData.RECORD);
  }, []);

  if (mainSetting) {
    return (
      <form id="mainSetting" data-whats="main">
        {/* 상단 컨트롤 타워 */}
        <section className="grid">
          <div className="card homepage-set-title-btn">
            <h3>메인 히어로 세션 설정</h3>
            <div className="btn-row">
              <div className="btn btn-muted" onClick={() => {
                if (window.confirm('메인페이지 설정을 초기화 시키시겠습니까?\n초기화 후 저장하여 홈페이지에 적용하시기 바랍니다.')) {
                  $("input[type='text']").val('');
                  $("input[type='checkbox']").prop('checked', true);
                  $("input[name='bgcolor']").val('#000000');
                  $("input[name='transparent']").val(50);
                  $("#menu_back_transparent").text("50%");
                  setContents('');
                }
              }}>
                <span>초기화</span>
              </div>
              <div className="btn btn-primary" onClick={() => {
                const form = document.getElementById("mainSetting");
                if (!form.checkValidity()) {
                  form.reportValidity();
                  return;
                }
                if (window.confirm('저장하시겠습니까?')) {
                  alert("성공적으로 저장되었습니다.");
                }
              }}>
                <span>저장하기</span>
              </div>
            </div>
          </div>
        </section>

        {/* 메인 슬라이드 이미지 등록 */}
        <section className="grid">
          <div className="card">
            <h3>배경 이미지 / 슬라이드 설정</h3>
            <p className="sub">메인페이지 최상단에 보여질 메인 visual 이미지들을 업로드해주세요.</p>

            <div className="btn_con">
              <div className="btn btn-plus">
                <label style={{ cursor: 'pointer', margin: 0 }}>
                  <input
                    type="file"
                    name="main_plus_slide"
                    style={{ display: 'none' }}
                    onClick={(e) => { e.stopPropagation() }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const newImg = {
                            img_no: Date.now(),
                            full_url: event.target.result
                          };
                          dispatch(plus_Mslide([newImg]));
                        };
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                    accept="image/png, image/jpeg"
                  />
                  <FontAwesomeIcon icon={faPlus} />
                  <span> 이미지 추가</span>
                </label>
              </div>
            </div>

            <div className="set_con slide">
              <ul className="slide_track">
                {main_slide === null || main_slide === '' ? null : main_slide.map(function (a, i) {
                  return (
                    <MainSlide data={main_slide} key={i} val={i} />
                  )
                })}
              </ul>
            </div>
          </div>
        </section>

        {/* 투명 딤(Dim) 레이어 설정 */}
        <section className="grid">
          <div className="card">
            <div className="title-checkCon">
              <h3>배경 오버레이 (Dim) 설정</h3>
              <div className="check_con">
                <label>
                  <input className="input_check_hidden" name="bgcolor_show" type="hidden" value='N'></input>
                  <input className="check_menu input_check" name="bgcolor_show" type="checkbox" value="Y" defaultChecked={mainSetting.row.bgcolor_show === "Y"}></input>
                  <div className="check_btn">
                    <span className="disabled">숨김</span>
                    <span className="abled">보임</span>
                    <div className="circle"></div>
                  </div>
                </label>
              </div>
            </div>
            <p className="sub">배경이미지 위에 텍스트 가독성을 높이기 위한 투명 오버레이 레이어를 설정합니다.</p>
            <div className="opa_con">
              <div className="opacity_con">
                <div className="card-content">
                  <p className="card-content-tit">오버레이 색상</p>
                  <input type="color" name="bgcolor" className="clr_input" defaultValue={mainSetting.row.bgcolor}></input>
                </div>
                <div className="card-content">
                  <p className="card-content-tit">투명도 <span id="menu_back_transparent">{mainSetting.row.transparent}%</span></p>
                  <input type="range" name="transparent" className="opacity_input" min={0} max={100} defaultValue={mainSetting.row.transparent} onChange={(e) => {
                    let val = e.target.value;
                    $("#menu_back_transparent").text(val + "%");
                  }}></input>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 메인 에디터 타이틀 세팅 */}
        <section className="grid">
          <div className="card">
            <div className="title-checkCon">
              <h3>메인 메세지(타이틀) 문구 설정</h3>
              <div className="check_con">
                <label>
                  <input className="input_check_hidden" name="title_show" type="hidden" value='N'></input>
                  <input className="check_menu input_check" name="title_show" type="checkbox" value='Y' defaultChecked={mainSetting.row.title_show === "Y"}></input>
                  <div className="check_btn">
                    <span className="disabled">숨김</span>
                    <span className="abled">보임</span>
                    <div className="circle"></div>
                  </div>
                </label>
              </div>
            </div>
            <p className="sub">메인 visual 영역 중앙에 노출할 핵심 브랜드 문구를 작성해주세요.</p>
            <div className="editor_con" style={{ marginTop: '15px' }}>
              <ReactQuill modules={modules} onChange={(e) => { setContents(e); }} value={contents} />
            </div>
          </div>
        </section>
      </form>
    )
  }
}

function MainSlide(props) {
  let dispatch = useDispatch();
  let [hover, setHover] = useState(false);

  return (
    <li>
      <div className={hover === true ? "img_con on" : "img_con"} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
        <div className="del_slide" onClick={() => {
          dispatch(minus_Mslide(props.val));
        }}>
          <FontAwesomeIcon icon={faTrashCan} />
          <p>이미지 삭제</p>
        </div>
        <img src={props.data[props.val].full_url} alt="슬라이드 이미지"></img>
      </div>
    </li>
  )
}

export default Set_main;