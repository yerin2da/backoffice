import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { change_page } from "../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery";
import axios from "axios";

function Edit_profile(){

  let dispatch = useDispatch();
  let [upload_logo_img, setUpload] = useState('');
  let [profile, setProfile] = useState();
  let [del, setDel] = useState('N');
  let navigate = useNavigate();
  let id = window.localStorage.getItem('id');
  let login_key = window.localStorage.getItem('login_key');
  const config = {
    headers : {
      'Authorization': `Bearer ${login_key}`
    }
  }
  console.log(id);

  useEffect(()=>{
    dispatch(change_page(''));
    if(profile){
      setUpload(profile.img_url);
    }
  }, [profile]);
  

  useMemo(()=>{
    return axios.get(process.env.REACT_APP_API_KEY+'Admin/Profile/data', config).then((result)=>{
      if(result.data.SUCCESS === "FALSE" ){
        console.log(result);
        alert(result.data.MSG);
        navigate('/');
      }else{
        setProfile(result.data.RECORD);
      }
      console.log(result);
      console.log(result.data);
    }).catch(()=>{alert('서버와의 연결이 끊겼습니다. 잠시 후 다시 시도해주십시오.'); window.location.href = '/';});;
  }, []);

  function preview(input){
    if (input.length !== 0) {
      console.log(input);
      var reader = new FileReader();
      reader.onload = function(e) {
        setUpload(e.target.result);
      };
      reader.readAsDataURL(input[0]);
    } else {
      return;
    }
  }

  console.log(profile);

  if(profile){
    return(
      <div className="page-container container profile-set-container">
        <div className="page-head">
          <h2>기본 정보 관리</h2>
        </div>

        {/* 타이틀/버튼 */}
        <section className="grid">
          <div className="card homepage-set-title-btn">
            <h3>프로필 설정</h3>
            <div className="btn-row">
              <div className="btn btn-primary" onClick={()=>{
                const this_form = document.getElementById("profileSetting");
                let formData = new FormData(this_form);
                if(window.confirm("저장하시겠습니까?")){
                  axios.post(process.env.REACT_APP_API_KEY+'Admin/Profile/save', formData, config).then((result)=>{
                    console.log(result);
                    alert('저장되었습니다');
                    window.location.href = '/';
                  }).catch(()=>{
                    alert('서버와의 연결이 끊겼습니다. 잠시 후 다시 시도해주십시오.');
                    window.location.href = '/';
                  });
                }
              }}><span>저장하기</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* 프로필 */}
        <section className="grid">
          <div className="card">
            <div className="title-checkCon">
              <h3>프로필</h3>
            </div>
            <p className="sub">최대 2MB까지 1:1 정사각형 사이즈로 올리면<br></br>이미지 찌그러짐 없이 잘 나옵니다.</p>

            <form id="profileSetting" data-whats="profile">
              <div className="input_con">
                <label>
                  <input type="file" name="img" accept="image/png, image/jpeg" onChange={(e)=>{preview(e.target.files)}}></input>
                  <div className="upload_img">
                    {upload_logo_img === '' || upload_logo_img === undefined ? <img src="img/header/profile_base.png"></img> : <img src={upload_logo_img} alt="이미지 경로를 확인해주세요"></img>}
                  </div>
                </label>
                {
                  upload_logo_img === '' ? null :
                  <div className="btn-minus">
                    <span onClick={()=>{
                      setDel('Y')
                      setUpload('');
                    }}><FontAwesomeIcon icon={faTrashCan}/></span>
                  </div>
                }
                <input type="hidden" name="img_del" defaultValue={del}></input>
                <input type="text" className="nick_name" name="nick_name" placeholder="닉네임" defaultValue={profile.nick_name}></input>
              </div>
            </form>
          </div>
        </section>
          
        {/* 관리자 정보 */}
        <div className="grid section_box card">
          <div className="sec_title_bar">
            <h4>관리자 정보</h4>
          </div>
          <p className="sub">※ 수정은 운영관리자만 가능합니다.</p>

          <div className="info-grid">

            <div className="info-item">
              <span className="info-label name_tit">이름</span>
              <span className="info-value name_val">{profile.user_info.name}</span>
            </div>

            <div className="info-item">
              <span className="info-label id_tit">아이디</span>
              <span className="info-value id_val">{profile.user_info.user_id}</span>
            </div>

            <div className="info-item">
              <span className="info-label tel_tit">전화번호</span>
              <span className="info-value tel_val">{profile.user_info.tel}</span>
            </div>

            <div className="info-item">
              <span className="info-label email_tit">이메일</span>
              <span className="info-value email_val">{profile.user_info.email}</span>
            </div>

          </div>
        </div>

        {/* 매장정보 */}
        <div className="grid section_box card">
          <div className="sec_title_bar">
            <h4>매장정보</h4>
          </div>
          <p className="sub">※ 수정은 운영관리자만 가능합니다.</p>


          <div className="info-grid">

            <div className="info-item">
              <span className="info-label shop_tit">매장명</span>
              <span className="info-value shop_val">{profile.mall_info.mall_name}</span>
            </div>

            <div className="info-item">
              <span className="info-label type_tit">주소</span>
              <span className="info-value type_val">{profile.mall_info.addr}</span>
            </div>

            <div className="info-item">
              <span className="info-label shop_tel_tit">대표 번호</span>
              <span className="info-value shop_tel_val">{profile.mall_info.tel}</span>
            </div>

            <div className="info-item">
              <span className="info-label email_tit">사업자번호</span>
              <span className="info-value email_val">{profile.mall_info.regist_num}</span>
            </div>

          </div>
        </div>
      </div>

    )
  }
}

export default Edit_profile;