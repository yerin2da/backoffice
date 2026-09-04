import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { change_page, log_in_out } from '../store';
import $ from 'jquery';
import Main from './Main';
import Basic from './Basic';
import Property from './Property';
import Note from './Note';
import Edit_profile from './Edit_profile';
import Property_form from './property_page/Property_form';
import Property_detail from './property_page/Property_detail';
import Note_form from './note_page/Note_form';
import Note_detail from './note_page/Note_detail';
import {
  Globe,
  Settings2,
  LogOut,
  PanelLeft,
  LayoutDashboard,
  Settings,
  ClipboardList,
  Building2,
  MessageSquare
} from "lucide-react";
import axios from 'axios';
import DashBoard from './dashBoard_page/DashBoard';

function Header(){

  let [data, setData] = useState();
  const [isCollapsed, setIsCollapsed] = useState(false);// 💡 사이드바 접힘/펼침 상태 (기본값: 펼침 false)
  let store = useSelector((state)=>{return state});
  let id = window.localStorage.getItem('id');
  let login_key = window.localStorage.getItem('login_key');
  let dispatch = useDispatch();
  let navigate = useNavigate();
  const config = {
    headers : {
      'Authorization': `Bearer ${login_key}`
    }
  }

  function log_out(){
    dispatch(log_in_out());
    window.localStorage.removeItem('id');
    window.localStorage.removeItem('login_key');
    navigate('/');
    window.location.reload();
  }

  useMemo(()=>{
    // axios.get 호출 대신 목업 데이터 세팅
    const mockProfileData = {
      img_url: '',
      nick_name: '관리자 대시보드',
      user_info: {
        name: '최고 관리자'
      }
    };
    setData(mockProfileData);
  }, []);

  const navList = [
    {
      key: "dash_board",
      path: "/dash_board",
      label: "대시보드",
      short: "대시보드",
      icon: LayoutDashboard,
    },
    {
      key: "basic",
      path: "/basic",
      label: "홈페이지 설정",
      short: "홈페이지",
      icon: Settings2,
    },
    {
      key: "property",
      path: "/property",
      label: "게시판 관리",
      short: "게시판",
      icon: Building2,
    },
    {
      key: "note",
      path: "/note",
      label: "메모 관리",
      short: "메모",
      icon: MessageSquare,
    },
  ];

  if(data)
    {
    return(
      <div className={`wrap ${isCollapsed ? 'collapsed' : ''}`}>
        <div id='header' className={`admin_layout ${isCollapsed ? "collapsed" : ""}`}>
          {/* 1. 좌측 사이드바 (LNB) */}
          <aside id="sidebar" className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Top: 최상단 로고 영역 */}
            <div className="logo_area">
              <Link to='/dash_board' onClick={()=>{dispatch(change_page(''));}}>

              <div className='company_logo'>
                <img src={data.img_url !== "" ? data.img_url : 'img/header/logo.jpg'} alt='로고이미지'></img>
              </div>

              <span className="company_name">{data.nick_name}</span>
              </Link>

            </div>

            {/* Middle: 메뉴 리스트 */}
            <nav className="nav_con">
              <ul>
                {navList.map((item) => (
                  <li
                    key={item.key}
                    onClick={() => dispatch(change_page(item.key))}
                    className={store.current_page === item.key ? 'on' : ''}
                  >
                    <Link to={item.path}>
                      <div className="nav-img-con">
                        <item.icon />
                      </div>
                      <span className="nav_label">
                        {isCollapsed ? item.short : item.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* 사이드바 최하단: 프로필 & 설정 영역*/}
            <div className="sidebar_bottom">
              {!isCollapsed && (
                <div className="user_mini_profile">
                    <span className="user_name">
                        {data.user_info.name || id}
                    </span>
                </div>
              )}

              <div className="bottom_actions">
                {/* 내 쇼핑몰 바로가기 */}
                <a 
                  href={'/basic'} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn_icon_action" 
                  title="내 홈페이지 바로가기"
                >
                  <Globe size={18}/>
                  {!isCollapsed && <span>홈페이지</span>}
                </a>

                {/* 프로필/계정 설정 (톱니바퀴) */}
                <Link to="/edit_profile" className="btn_icon_action" title="프로필 설정">
                  <Settings size={18}/>
                  {!isCollapsed && <span>프로필 설정</span>}
                </Link>

                {/* 로그아웃 */}
                <button 
                  type="button" 
                  className="btn_logout_text" 
                  onClick={() => { if (window.confirm('로그아웃 하시겠습니까?')) log_out(); }}
                >
                  <LogOut size={18}/>
                  {!isCollapsed && <span>로그아웃</span>}
                </button>
              </div>
            </div>

          </aside>

          <div
            className="btn_open"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
              <PanelLeft size={18} />
          </div>
        </div>

        <Routes>
          <Route path='/' element={ <Main></Main> }></Route>
          <Route path='/edit_profile' element={ <Edit_profile></Edit_profile> }></Route>
          <Route path='/basic' element={ <Basic></Basic> }></Route>
          <Route path='/property' element={ <Property></Property> }></Route>
          <Route path='/note' element={ <Note /> }></Route>
          <Route path='/dash_board' element={ < DashBoard/> }></Route>

          {/* 매물 등록 */}
          <Route path="/property/write" element={<Property_form />} />

          {/* 매물 수정 (URL 파라미터 :property_no 받기) */}
          <Route path="/property/edit/:property_no" element={<Property_form />} />

          {/* 매물 상세 조회 */}
          <Route path="/property/view/:property_no" element={<Property_detail />} />

          {/* 메모 등록 */}
          <Route path="/note/write" element={<Note_form />} />

          {/* 메모 수정 (URL 파라미터 :note_no 받기) */}
          <Route path="/note/edit/:note_no" element={<Note_form />} />

          {/* 메모 상세 조회 */}
          <Route path="/note/view/:note_no" element={<Note_detail />} />
        </Routes>
      </div>
    )
  }
}

export default Header