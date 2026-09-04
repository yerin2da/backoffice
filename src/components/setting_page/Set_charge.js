import { useEffect, useState } from "react"
// import { useDispatch, useSelector } from "react-redux";
// import { change_set } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import $ from "jquery";
// import "slick-carousel/slick/slick.css"; 
// import "slick-carousel/slick/slick-theme.css";
// import Slider from "react-slick";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import post_ajax from "../../ajaxs";
import del_img from './del_fn';

function Set_charge(){
  let [chargeSetting, setChaergeSetting] = useState();
  let [contents, setContents] = useState("");
  let [upload_logo_img, setUpload] = useState('');
  // let dispatch = useDispatch();
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

  useEffect(()=>{
    return axios.get(
      process.env.REACT_APP_API_KEY+'Admin/Menu/data?code=charge',
      config
      )
      .then((result)=>{
        setChaergeSetting(result.data.RECORD); 
        // console.log('아작스 통신', result)
      })
      .catch(()=>{
        alert('서버와의 연결이 끊겼습니다. 잠시 후 다시 시도해주십시오.');
        window.location.href = '/';
    });
  }, []);

  useEffect(()=>{
    if(chargeSetting){
      setContents(chargeSetting.row.title);
      if(chargeSetting.img !== null){
        setUpload(chargeSetting.img[0].full_url);
      }
    }
  }, [chargeSetting])

  function preview(input){
    if (input.length !== 0) {
      // console.log(input);
      var reader = new FileReader();
      reader.onload = function(e) {
        setUpload(e.target.result);
      };
      reader.readAsDataURL(input[0]);
    } else {
      return;
    }
  }

  // console.log(chargeSetting);

  if(chargeSetting){
    return(
      <form id="chargeSetting" data-whats="charge">
        <div className="row row1">
          <div className="title_con">
            <h4>이용요금 페이지 설정</h4>
          </div>
          <div className="btn_con">
            <div className="btns temporary" onClick={()=>{
              if(window.confirm('이용요금 페이지 설정을 초기화 시키시겠습니까?\n초기화 후 저장하여 홈페이지에 적용하시기 바랍니다.')){
                $("input[type='checkbox']").prop('checked', true);
                $("input[name='bgcolor']").val('#f5f5f5');
                $("input[name='transparent']").val(0);
                $("#menu_back_transparent").text(0+"%");
                setContents('');
              }
            }}>
              <span>초기화</span>
            </div>
            <div className="btns apply" onClick={()=>{
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
        <div className="row row2">
          <div className="title_con">
            <h5>배경 설정 (선택)</h5>
          </div>
          <p className="row_desc">해당페이지 배경 이미지와 색을 설정해주세요 / 이미지, 배경색 순으로 나타납니다. / 미입력시 기본값으로 적용</p>
          <div className="inner_con">
            <div className="input_con img_input">
              <label>
                <input type="file" name="file" accept="image/png, image/jpeg" onChange={(e)=>{
                  preview(e.target.files);
                  if(chargeSetting.img !== null){
                    del_img(chargeSetting.img, config);
                  }
                }}></input>
                <div className="upload_img">
                  {upload_logo_img === '' ? <img src="img/basic/notice/notice_base.jpg" alt="배경이미지"></img> : <img src={upload_logo_img}  alt="배경이미지"></img>}
                </div>
              </label>
              {
                upload_logo_img === '' ? null : <div className="btn-minus" onClick={()=>{
                  if(chargeSetting.img !== null){
                    del_img(chargeSetting.img, config);
                  }
                  setUpload('');
                }}>
                  <FontAwesomeIcon icon={faTrashCan}/>
                </div>
              }
              <div className="ex_con">
                <p className="row_desc">결과예시)</p>
                <img src="img/basic/notice/bgEx2.jpg" alt="결과예시"></img>
              </div>
            </div>
            <div className="opa_con">
              <div className="opacity_con">
                <input type="color" name="bgcolor" className="clr_input" defaultValue={chargeSetting.row.bgcolor}></input>
                <div className="range_con">
                  <input type="range" name="transparent" className="opacity_input" min={0} max={100} defaultValue={chargeSetting.row.transparent} onChange={(e)=>{
                    let val = e.target.value;
                    $("#menu_back_transparent").text(val+"%")
                  }}></input>
                  <p className="opa"><span>{chargeSetting.row.transparent}%</span>배경색 투명도</p>
                </div>
              </div>
              <div className="ex_con">
                <p className="row_desc">결과예시)</p>
                <img src="img/basic/notice/bgEx1.jpg" alt="결과예시"></img>
              </div>
            </div>
          </div>
        </div>
        <div className="row row3">
          <div className="title_con">
            <h5>타이틀문구 설정</h5>
            <div className="check_con">
              <label>
                <input className="input_check_hidden" name="title_show" type="hidden" value='N'></input>
                <input className="check_menu input_check" name="title_show" type="checkbox" value='Y' defaultChecked={chargeSetting.row.title_show === "Y" ? true : false}></input>
                <div className="check_btn">
                  <span className="disabled">숨김</span>
                  <span className="abled">보임</span>
                  <div className="circle"></div>
                </div>
              </label>
            </div>
          </div>
          <p className="row_desc">해당페이지 내 타이틀 문구를 설정해주세요</p>
          <div className="editor_con">
            <ReactQuill modules={modules} onChange={(e)=>{setContents(e);}} value={contents}></ReactQuill>
          </div>
        </div>
      </form>
    )
  }
}

export default Set_charge