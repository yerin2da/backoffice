import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { change_page, minus_list, plus_list } from "../store";
import Brd_all from './board_page/Brd_all';
import axios from "axios";
// import './board_page/brd.css';
import './board.css';

function Board(){

  let [select, setSelect] = useState('all');
  let [data, setData] = useState();
  let [copy_data, setCopy] = useState();
  let dispatch = useDispatch();
  let id = window.localStorage.getItem('id');
  let login_key = window.localStorage.getItem('login_key');
  const config = {
    headers : {
      'Authorization': `Bearer ${login_key}`
    }
  }

  useEffect(()=>{
    if(data){
      setCopy(data.rows);
    }
  }, [data]);

  useEffect(()=>{
    dispatch(change_page('board'));
  }, [])

  const fetchBoard = () => {
    axios.get(
      process.env.REACT_APP_API_KEY+'Admin/Board/list?limit=8',
       config
      )
       .then((result)=>{
        console.log(result.data.RECORD); 
        setData(result.data.RECORD)
      });
  };
  useEffect(()=>{
    fetchBoard();
  }, []);

  console.log(data)
  console.log('렌더링!');
  if(data){
    return(
      <div className="page-container container board-page-container">
        <div className="page-head">
          <h2>게시판 관리</h2>
        </div>
        <div className="section board ">
          <div className="width_con">
            <ul className="tabs">
              <li onClick={()=>{
                setSelect('all');
                axios.get(process.env.REACT_APP_API_KEY+'Admin/Board/list?limit=8', config).then((result)=>{console.log(result.data.RECORD); setData(result.data.RECORD)});
              }} className={select === 'all' ? "on" : null}>
                <h5>전체</h5>
                <div className="status">
                  <p>글 총갯수</p>
                  <div className="counting">
                    <span className="whole">{data.boards.around.total_count}</span>
                  </div>
                </div>
              </li>
              <li onClick={()=>{
                setSelect('notice');
                // let copy = [...data.rows];
                // const filtering = ['notice', 'event'];
                // copy = copy.filter((a)=> a.board_type === 'notice' || a.board_type === 'event');
                // setCopy(copy);
                axios.get(process.env.REACT_APP_API_KEY+'Admin/Board/list?limit=8&code=notice', config).then((result)=>{console.log(result.data.RECORD); setData(result.data.RECORD)});
              }} className={select === 'notice' ? "on" : null}>
                <h5>공지&이벤트</h5>
                <div className="status">
                  <p>글 총갯수</p>
                  <div className="counting">
                    <span className="whole">{data.boards.notice.total_count}</span>
                  </div>
                </div>
              </li>

              {/* 이용요금 
              <li onClick={()=>{
                setSelect('charge');
                // let copy = [...data.rows];
                // copy = copy.filter((a)=> a.board_type === 'charge');
                // setCopy(copy);
                axios.get(process.env.REACT_APP_API_KEY+'Admin/Board/list?limit=8&code=charge', config).then((result)=>{console.log(result.data.RECORD); setData(result.data.RECORD)});
              }} className={select === 'charge' ? "on" : null}>
                <h5>이용요금</h5>
                <div className="status">
                  <p>글 총갯수</p>
                  <div className="counting">
                    <span className="whole">{data.boards.charge.total_count}</span>
                  </div>
                </div>
              </li> */}
              
              <li onClick={()=>{
                setSelect('review');
                // let copy = [...data.rows];
                // copy = copy.filter((a)=> a.board_type === 'review');
                // setCopy(copy);
                axios.get(process.env.REACT_APP_API_KEY+'Admin/Board/list?limit=8&code=review', config).then((result)=>{console.log(result.data.RECORD); setData(result.data.RECORD)});
              }} className={select === 'review' ? "on" : null}>
                <h5>이용후기</h5>
                <div className="status">
                  <p>글 총갯수</p>
                  <div className="counting">
                    <span className="whole">{data.boards.review.total_count}</span>
                  </div>
                </div>
              </li>
              
              {/* 홍보영상 
              <li onClick={()=>{
                setSelect('vod');
                // let copy = [...data.rows];
                // copy = copy.filter((a)=> a.board_type === 'vod');
                // setCopy(copy);
                axios.get(process.env.REACT_APP_API_KEY+'Admin/Board/list?limit=8&code=vod', config).then((result)=>{console.log(result.data.RECORD); setData(result.data.RECORD)});
              }} className={select === 'vod' ? "on" : null}>
                <h5>홍보영상</h5>
                <div className="status">
                  <p>글 총갯수</p>
                  <div className="counting">
                    <span className="whole">{data.boards.vod.total_count}</span>
                  </div>
                </div>
              </li> */}
            </ul>
            <div className="board_con">
              <Brd_all 
              origin_data={data} 
              data={copy_data} 
              whats={select}
              refreshParent={fetchBoard}
              ></Brd_all>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Board;