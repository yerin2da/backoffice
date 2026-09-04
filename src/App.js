import './New.css';
import './new_slide.css';
import { Routes, Route, Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { log_in_out, set_idkey } from './store';
import $ from 'jquery';
import axios from 'axios';
import Header from './components/Header';


function App() {
console.log("REACT_APP_API_KEY : " + process.env.REACT_APP_API_KEY);
  let alt = useSelector((state)=>{return state.alt_log});
  let dispatch = useDispatch();
  let id = window.localStorage.getItem('id');
  let login_key = window.localStorage.getItem('login_key');
  console.log(alt, id, login_key);

  const urlParams = new URL(window.location.href).searchParams;
  const pathname = window.location.pathname;

  const session = urlParams.get('session');
  const session_token = urlParams.get('session_token');
  const login_id = urlParams.get('id');
  const time = urlParams.get('time');

  console.log('현재 경로:', pathname);
  console.log('자동 로그인 GET 값:', {
    session_token,
    login_id,
    time
  });

  useEffect(()=>{
    if(id){
      //dispatch(set_idkey([id, login_key]));

    }
    if (
      id !== null &&
      alt === false &&
      pathname !== '/session_login'
    ) {
      dispatch(log_in_out());
    }
}, []);
  
  // AD → BO 자동로그인
  useEffect(()=>{
    // /session_login으로 들어온 경우에만 특별 로그인
    if (
      pathname !== '/session_login' ||
      !session_token ||
      !login_id ||
      !time
    ) {
      return;
    }

    // 기존 로그인 정보 제거
    window.localStorage.removeItem('id');
    window.localStorage.removeItem('login_key');

    const formData = new FormData();

    formData.append('session_token', session_token);
    formData.append('id', login_id);
    formData.append('time', time);
    // formData.append('session_id', session);

    axios.post(process.env.REACT_APP_API_KEY+'Admin/User/sessionlogin', formData).then((result)=>{
      console.log(result);

      if(result.data.SUCCESS === "TRUE"){
        dispatch(log_in_out());
        window.localStorage.setItem('login_key', result.data.MSG.session_id);
        window.localStorage.setItem('id', result.data.MSG.fid);
      }else{
        alert(result.data.MSG);
      }
    
    }).catch((error)=>{
      console.error('자동 로그인 실패:', error);
    });
      
  }, [pathname, session_token, login_id, time, dispatch])

  function log_in(){
    if(alt === false){
      let testForm = document.getElementById('form_login');
      let formData = new FormData(testForm);
      axios.post(process.env.REACT_APP_API_KEY+'Admin/User/login', formData).then((result)=>{
        console.log(result);
        if(result.data.MSG.fid === ''){
          alert('매장정보없음');
        }else{
          // 기존 로그인 정보 삭제
          window.localStorage.removeItem('id');
          window.localStorage.removeItem('login_key');

          // 새 로그인 정보 저장
          dispatch(log_in_out());
          window.localStorage.setItem('login_key', result.data.MSG.session_id);
          window.localStorage.setItem('id', result.data.MSG.fid);
        }
      }).catch(()=>{
        alert("아이디와 비밀번호를 확인해주세요.");
      });
    }
  }

  return (
    <div className="App">
      <Header></Header> 
    </div>
  );
}

export default App;
