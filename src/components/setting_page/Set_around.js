import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { minus_Aslide, plus_Aslide } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";
import axios from "axios";
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";
// import Slider from "react-slick";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import post_ajax from "../../ajaxs";
// import del_img from './del_fn';

function Set_around(){

  let dispatch = useDispatch();
  let [aroundSetting, setAroundSetting] = useState();
  let [contents, setContents] = useState("");
  let store = useSelector((state)=>{return state});
  let around_slide = store.set_around_slide;
  let [ticking, setTicking] = useState();
  // let [upload_logo_img, setUpload] = useState('');
  // let id = window.localStorage.getItem('id');
  let login_key = window.localStorage.getItem('login_key');

  const config = {
    headers : {
      'Authorization': `Bearer ${login_key}`
    }
  }

  const modules = {
    toolbar: {
        container: [
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'font': [] }],
          [{ 'align': [] }],
          ['bold', 'italic', 'underline', 'blockquote'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }, 'link'],
          [{ 'color': ['#000000', '#e60000', '#ff9900', '#ffff00', '#008a00', '#0066cc', '#9933ff', '#ffffff', '#facccc', '#ffebcc', '#ffffcc', '#cce8cc', '#cce0f5', '#ebd6ff', '#bbbbbb', '#f06666', '#ffc266', '#ffff66', '#66b966', '#66a3e0', '#c285ff', '#888888', '#a10000', '#b26b00', '#b2b200', '#006100', '#0047b2', '#6b24b2', '#444444', '#5c0000', '#663d00', '#666600', '#003700', '#002966', '#3d1466', 'custom-color'] }, { 'background': [] }],
          ['clean']  
        ],
    }
  }

  useEffect(() => {
    if(ticking === true || ticking === undefined){
      axios.get(
        process.env.REACT_APP_API_KEY+'Admin/Menu/data?code=around', 
        config
      )
      .then((result)=>{
        setAroundSetting(result.data.RECORD);
        // console.log('아작스 통신', result)
      })
      .catch(()=>{
        alert('서버와의 연결이 끊겼습니다. 잠시 후 다시 시도해주십시오.');
        window.location.href = '/';
      });
    }
  }, [ticking]);

  useEffect(()=>{
    if(aroundSetting){
      setContents(aroundSetting.row.title);
      dispatch(plus_Aslide(aroundSetting.img));
      if(aroundSetting.img !== null){
        //setUpload(aroundSetting.img[0].full_url);
      }
    }
    setTicking(false);
  }, [aroundSetting])

  // function preview(input){
  //   if (input.length !== 0) {
  //     // console.log(input);
  //     var reader = new FileReader();
  //     reader.onload = function(e) {
  //       setUpload(e.target.result);
  //     };
  //     reader.readAsDataURL(input[0]);
  //   } else {
  //     return;
  //   }
  // }

  // const settings = {
  //   dots: false,
  //   infinite: false,
  //   draggable: false,
  //   speed: 500,
  //   slidesToShow: 2,
  //   slidesToScroll: 1
  // };

  // console.log(aroundSetting)
  
  if(aroundSetting){
    return(
      <form id="aroundSetting" data-whats="around">
        {/* 타이틀/버튼 */}
        <section className="grid">
          <div className="card homepage-set-title-btn">
            <h3>둘러보기 페이지 설정</h3>       
            <div className="btn-row">
              <div className="btn btn-muted" onClick={()=>{
                if(window.confirm('둘러보기 페이지 설정을 초기화 시키시겠습니까?\n초기화 후 저장하여 홈페이지에 적용하시기 바랍니다.')){
                  $("input[type='checkbox']").prop('checked', true);
                  $("input[name='bgcolor']").val('#f5f5f5');
                  $("input[name='transparent']").val(0);
                  $("#menu_back_transparen").text(0+"%");
                  setContents('');
                }
              }}>
                <span>초기화</span>
              </div>
              <div className="btn btn-primary" onClick={()=>{
                  const this_form = $("form").attr("id");
                  let whats = $("form").attr("data-whats");
                  if(window.confirm('저장하시겠습니까?')){
                    post_ajax(this_form, whats, config, contents);
                    // dispatch(change_set(0));
                  }
                }}>
              <span>저장하기</span>
              </div>
            </div>
          </div>
        </section>


        <section className="grid">
          <div className="card">
            <h3>이미지 슬라이드 설정</h3>
            <p className="sub">사이트 내 일반 슬라이드에 들어갈 이미지를 설정해주세요</p>
            
            {/* 이미지 추가 버튼 */}
            <div className="btn_con">
              <div className="btn btn-plus">
                <label>
                  <input type="file" name="around_plus_slide" onClick={(e)=>{e.stopPropagation()}} onChange={(e)=>{
                    let formData = new FormData();
                    formData.append('code', 'around');
                    formData.append('file', e.target.files[0]);
                    axios.post(
                      process.env.REACT_APP_API_KEY+'Admin/Menu/file_up', formData, 
                      config
                    )
                    .then((result)=>{
                      // console.log(result.data); 
                      setTicking(true)}).catch(()=>{
                      alert("이미지를 추가할 수 없습니다.\n잠시 후에 다시 시도해주십시오.");
                    });
                    // for (const [key, value] of formData.entries()) {
                    //   console.log(key, value);
                    // }
                  }} accept="image/png, image/jpeg"></input>
                    <FontAwesomeIcon icon={faPlus}/>
                    <span> 이미지 추가</span>
                </label>
              </div>
            </div>

            {/* 이미지 슬라이드 설정 */}
            <div className="set_con slide">
                <div className="slide_track">
                  {/* <Slider {...settings}> */}
                    {around_slide === null || around_slide === '' ? null : around_slide.map(function(a, i){
                      return(
                        <AroundSlide cfg={config} data={around_slide} key={i} val={i}/>
                      )
                    })}
                  {/* </Slider> */}
              </div>
            </div>
          </div>
        </section>

        {/* 배경색 설정 (선택) */}
        <section className="grid">
          <div className="card">
            <div className="title-checkCon">
              <h3>배경색 설정 (선택)</h3>
            </div>
            <p className="sub">해당페이지 배경색을 설정해주세요. / 미입력시 기본값으로 적용</p>
          
            <div className="background_con">
              <div className="opa_con">
                <div className="opacity_con">
                  {/* 배경색 */}
                  <div className="card-content">
                    <p className="card-content-tit">배경색</p>
                    <input type="color" name="bgcolor" className="clr_input" defaultValue={aroundSetting.row.bgcolor}></input>
                  </div>

                   {/* 투명도 */}
                  <div className="card-content">
                    <p className="card-content-tit">투명도 <span id="menu_back_transparent">{aroundSetting.row.transparent}%</span></p>
                    <div className="range_con">
                      <input type="range" name="transparent" className="opacity_input" min={0} max={100} defaultValue={aroundSetting.row.transparent} onChange={(e)=>{
                        let val = e.target.value;
                        $("#menu_back_transparent").text(val+"%")
                      }}></input>
                    </div>
                  </div>                
                </div>

                <div className="ex_con">
                  <div className="ex_rows">
                    <p className="card-content-tit">결과예시</p>
                    <img src="img/basic/notice/bgEx1.jpg" alt="결과예시"></img>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 타이틀 문구 설정 */}
        <section className="grid">
          <div className="card">

            <div className="title-checkCon">
              <h3>타이틀문구 설정</h3>
              <div className="check_con">
                <label>
                  <input className="input_check_hidden" name="title_show" type="hidden" value='N'></input>
                  <input className="check_menu input_check" name="title_show" type="checkbox" value='Y' defaultChecked={aroundSetting.row.title_show === "Y" ? true : false}></input>
                  <div className="check_btn">
                    <span className="disabled">숨김</span>
                    <span className="abled">보임</span>
                    <div className="circle"></div>
                  </div>
                </label>
              </div>
            </div>
            <p className="sub">해당페이지 내 타이틀 문구를 설정해주세요</p>
            <div className="editor_con">
              <ReactQuill modules={modules} onChange={(e)=>{setContents(e);}} value={contents}></ReactQuill>
            </div>
          </div>
        </section>
        
        

      </form>
    )
  }
}

function AroundSlide(props){

  let dispatch = useDispatch();

  let [hover, setHover] = useState(false);

  const mouseover = () => {
    setHover(true);
  }

  const mouseleave = () => {
    setHover(false);
  }
  
  return(
    <li>
      <div className={hover === true ? "img_con on" : "img_con"} onMouseOver={mouseover} onMouseOut={mouseleave}>
        <div className="del_slide" onClick={()=>{
          let formData = new FormData();
          formData.append('img_no', props.data[props.val].img_no);
          axios.post(process.env.REACT_APP_API_KEY+'Admin/Menu/file_del', formData, props.cfg)
          .then((result)=>{
            // console.log(result.data);
          })
          .catch(()=>{
            alert("이미지를 삭제할 수 없습니다.\n잠시 후에 다시 시도해주십시오.");
          });
          // for (const [key, value] of formData.entries()) {
          //   console.log(key, value);
          // }
          dispatch(minus_Aslide(props.val))
        }}>
          <FontAwesomeIcon icon={faTrashCan}/>
          <p>이미지 삭제</p>
        </div>
        <img src={props.data[props.val].full_url} alt="이미지 삭제"></img>
      </div>
    </li>
  )
}

export default Set_around