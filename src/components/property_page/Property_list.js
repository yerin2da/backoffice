import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux'; 
// import { useDispatch } from 'react';
import { change_page, now_property_view } from '../../store';
import { Link } from 'react-router-dom';
import '../board.css';
import './property.css';

// 테스트용 목업 데이터 (부동산 관련 내용 제외)
const MOCK_DATA_LIST = [
  {
    property_no: 101,
    transaction_type: 'sale',
    transaction_type_txt: '일반',
    property_type: 'office',
    property_type_txt: '전자기기',
    property_name: '고성능 게이밍 노트북 팝니다',
    addr_sigungu: '서울시',
    addr_dong: '강남구',
    sale_price: 150000,
    jeonse_price: 0,
    deposit_price: 0,
    monthly_rent: 0,
    status: '1',
    status_txt: '거래가능',
    display_yn: '1',
    display_yn_txt: '노출',
    view_count: 128,
    updated_at: '2026-03-01'
  },
  {
    property_no: 102,
    transaction_type: 'monthly',
    transaction_type_txt: '렌탈',
    property_type: 'etc',
    property_type_txt: '도서/음반',
    property_name: '개발자 필독서 전권 세트',
    addr_sigungu: '경기도',
    addr_dong: '성남시',
    sale_price: 0,
    jeonse_price: 0,
    deposit_price: 10000,
    monthly_rent: 2000,
    status: '2',
    status_txt: '거래중',
    display_yn: '1',
    display_yn_txt: '노출',
    view_count: 45,
    updated_at: '2026-02-28'
  },
  {
    property_no: 103,
    transaction_type: 'jeonse',
    transaction_type_txt: '예약',
    property_type: 'commercial',
    property_type_txt: '의류/잡화',
    property_name: '미개봉 스마트워치 블랙',
    addr_sigungu: '부산시',
    addr_dong: '해운대구',
    sale_price: 0,
    jeonse_price: 35000,
    deposit_price: 0,
    monthly_rent: 0,
    status: '3',
    status_txt: '거래완료',
    display_yn: '2',
    display_yn_txt: '비노출',
    view_count: 310,
    updated_at: '2026-02-25'
  },
  {
    property_no: 104,
    transaction_type: 'sale',
    transaction_type_txt: '일반',
    property_type: 'apt',
    property_type_txt: '생활가전',
    property_name: '스마트 공기청정기 대형',
    addr_sigungu: '인천시',
    addr_dong: '연수구',
    sale_price: 28000,
    jeonse_price: 0,
    deposit_price: 0,
    monthly_rent: 0,
    status: '1',
    status_txt: '거래가능',
    display_yn: '1',
    display_yn_txt: '노출',
    view_count: 89,
    updated_at: '2026-02-20'
  }
];

function Property_list(props) {
  let [now_data, setNow_data] = useState([]);
  let [now_page, setNow_page] = useState(1);
  let [page_info, setPage_info] = useState();

  // 검색 필터 state
  const [propertyType, setPropertyType] = useState('all');
  const [transaction_type, setTransaction_type] = useState('all');
  const [tradeStatus, setTradeStatus] = useState('all');
  const [regionTxt, setRegionTxt] = useState('');
  const [propertyNameTxt, setPropertyNameTxt] = useState('');

  let id = window.localStorage.getItem('id');
  let login_key = window.localStorage.getItem('login_key');
  const config = {
    headers: {
      'Authorization': `Bearer ${login_key}`
    }
  };

  // 목업 데이터 로드 함수 (Axios 대체)
  const fetchData = useCallback((page = now_page) => {
    let filteredList = [...MOCK_DATA_LIST];

    // 조건 필터링
    if (props.whats === "display_y") {
      filteredList = filteredList.filter(item => item.display_yn === "1");
    }
    if (props.whats === "display_n") {
      filteredList = filteredList.filter(item => item.display_yn === "2");
    }
    if (props.whats === "status_3") {
      filteredList = filteredList.filter(item => item.status === "3");
    }

    if (propertyType !== "all") {
      filteredList = filteredList.filter(item => item.property_type === propertyType);
    }
    if (transaction_type !== "all") {
      filteredList = filteredList.filter(item => item.transaction_type === transaction_type);
    }
    if (tradeStatus !== "all") {
      filteredList = filteredList.filter(item => item.status === tradeStatus);
    }
    if (regionTxt.trim()) {
      filteredList = filteredList.filter(item =>
        (item.addr_sigungu + item.addr_dong).includes(regionTxt.trim())
      );
    }
    if (propertyNameTxt.trim()) {
      filteredList = filteredList.filter(item =>
        item.property_name.includes(propertyNameTxt.trim())
      );
    }

    // 목업 페이징 계산 (페이지 당 8개 기준)
    const limit = 8;
    const totalCount = filteredList.length;
    const totalPage = Math.ceil(totalCount / limit) || 1;
    const startIndex = (page - 1) * limit;
    const rows = filteredList.slice(startIndex, startIndex + limit);

    setNow_data(rows);
    setPage_info({
      total_page: totalPage,
      item_num_start: totalCount - startIndex,
      current_page: page
    });
  }, [now_page, propertyType, transaction_type, tradeStatus, regionTxt, propertyNameTxt, props.whats]);

  useEffect(() => {
    setNow_page(1);
  }, [props.whats]);

  useEffect(() => {
    fetchData(now_page);
  }, [now_page, props.whats, fetchData]);

  const handleSearch = () => {
    if (now_page === 1) {
      fetchData(1);
    } else {
      setNow_page(1);
    }
  };

  const handleReset = () => {
    setPropertyType("all");
    setTransaction_type("all");
    setTradeStatus("all");
    setRegionTxt("");
    setPropertyNameTxt("");
  };

  let page = [];
  if (page_info) {
    for (let i = 0; i < page_info.total_page; i++) {
      page.push('');
    }
  }

  if (now_data) {
    return (
      <div className="brd all_brd">
        <div className="toolbar">
          <div className="toolbar-search">
            <select className="text-input" value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
              <option value="all">카테고리</option>
              <option value="apt">생활가전</option>
              <option value="officetel">디지털</option>
              <option value="office">전자기기</option>
              <option value="commercial">의류/잡화</option>
              <option value="etc">도서/음반</option>
            </select>
            <select className="text-input" value={transaction_type} onChange={(e) => setTransaction_type(e.target.value)}>
              <option value="all">거래방식</option>
              <option value="sale">일반</option>
              <option value="jeonse">예약</option>
              <option value="monthly">렌탈</option>
            </select>
            <input
              type="text"
              className="text-input"
              placeholder="지역"
              value={regionTxt}
              onChange={(e) => setRegionTxt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setNow_page(1);
                  handleSearch(1);
                }
              }}
            />
            <input
              type="text"
              className="text-input"
              placeholder="제목"
              value={propertyNameTxt}
              onChange={(e) => setPropertyNameTxt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setNow_page(1);
                  handleSearch(1);
                }
              }}
            />
            <div className="toolbar-actions">
              <div className="btn btn-muted" onClick={() => handleSearch()}>
                <span>검색</span>
              </div>
              <div className="btn btn-muted" onClick={handleReset}>
                <span>초기화</span>
              </div>
            </div>
            <div className="toolbar-register">
              <Link to="/property/write" className="btn btn-primary">글 등록</Link>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>글번호</th>
                <th>방식</th>
                <th>종류</th>
                <th>제목</th>
                <th>지역</th>
                <th>가격</th>
                <th>상태</th>
                <th>노출</th>
                <th>조회</th>
                <th>등록일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {now_data && now_data.length > 0 ? (
                now_data.map((item, i) =>
                  <Rows
                    key={item.property_no || i}
                    cfg={config}
                    data={item}
                    page_data={page_info}
                    index={i}
                    refreshData={fetchData}
                    refreshParent={props.refreshParent}
                  />
                )
              ) : (
                <tr>
                  <td colSpan="11">
                    조회된 데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <ul className='pagenation property_pagenation'>
          {page.map(function (a, i) {
            return (
              <li className={now_page === i + 1 ? 'on' : null} key={i} onClick={() => { setNow_page(i + 1); }}>
                <span>{i + 1}</span>
              </li>
            )
          })}
        </ul>
      </div>
    );
  }
}

function Rows(props) {
  let dispatch = useDispatch();
  const data = props.data;
  const page_datas = props.page_data;

  if (!data) {
    return null;
  }

  const formatPrice = (price) => {
    if (!price || Number(price) === 0) return "-";
    return `${Number(price).toLocaleString()}원`;
  };

  const formatMonthlyPrice = (deposit, rent) => {
    const depositText = Number(deposit) > 0 ? formatPrice(deposit) : "-";
    const rentText = Number(rent) > 0 ? Number(rent).toLocaleString() : "-";
    return `${depositText} / ${rentText}`;
  };

  const getTradePrice = (data) => {
    switch (data.transaction_type) {
      case "sale":
        return formatPrice(data.sale_price);
      case "jeonse":
        return formatPrice(data.jeonse_price);
      case "monthly":
        return formatMonthlyPrice(data.deposit_price, data.monthly_rent);
      default:
        return "-";
    }
  };

  const statusClass = {
    '1': 'possible',
    '2': 'ing',
    '3': 'complete',
    '4': 'pending',
    '5': 'private'
  };
  const statusKey = data.status ? String(data.status) : '1';

  const displayClass = {
    '1': 'display_y',
    '2': 'display_n'
  };

  // 삭제 처리 목업
  const handleDelete = () => {
    if (window.confirm("삭제하시겠습니까?")) {
      alert("삭제되었습니다. (목업 동작)");
      if (props.refreshData) props.refreshData();
      if (props.refreshParent) props.refreshParent();
    }
  };

  return (
    <tr className={data.display_yn === "2" ? "deleted" : ""}>
      <td>
        {Number(page_datas.item_num_start) - props.index}
      </td>
      <td>
        {data.transaction_type_txt || '-'}
      </td>
      <td>
        {data.property_type_txt || '-'}
      </td>
      <td className="col-property">
        <Link to={`/property/view/${data.property_no}`} onClick={() => { dispatch(now_property_view(data)); }}>
          {data.property_name || '-'}
        </Link>
      </td>
      <td>
        {`${data.addr_sigungu || ''} ${data.addr_dong || ''}`.trim() || '-'}
      </td>
      <td>
        {getTradePrice(data)}
      </td>
      <td>
        <span className={`tag ${statusClass[statusKey]}`}>
          {data.status_txt || '-'}
        </span>
      </td>
      <td>
        <span className={`tag ${displayClass[data.display_yn]}`}>
          {data.display_yn_txt || '-'}
        </span>
      </td>
      <td>
        {data.view_count || 0}
      </td>
      <td className="col-date">
        {data.updated_at || '-'}
      </td>
      <td>
        <div className="row-actions">
          <Link className="btn btn-muted" to={`/property/edit/${data.property_no}`}>
            수정
          </Link>
          <div className="btn btn_del" onClick={handleDelete}>
            삭제
          </div>
        </div>
      </td>
    </tr>
  );
}

export default Property_list;