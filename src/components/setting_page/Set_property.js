import { useEffect, useState } from "react"
// import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
// import { change_set, minus_list, plus_del, plus_list, replace_list } from "../../store";
import $ from "jquery";
import post_ajax from "../../ajaxs";
import axios from "axios";
import del_img from './del_fn';

function Set_property(props){
  let [propertySetting, setPropertySetting] = useState();//배경
  let [functionMenuSetting, setFunctionMenuSetting] = useState();//메뉴

  let [contents, setContents] = useState("");
  let [upload_logo_img, setUpload] = useState('');
  // let dispatch = useDispatch();
  // let store = useSelector((state)=>{return state});
  // let id = window.localStorage.getItem('id');
  let login_key = window.localStorage.getItem('login_key');

  const config = {
    headers : {
      'Authorization': `Bearer ${login_key}`
    }
  }

  //이미지 설정
  useEffect(() => {
    if (!propertySetting) return;

    setContents(propertySetting.row.title);

    if (propertySetting.img && propertySetting.img.length > 0) {
      setUpload(propertySetting.img[0].full_url);
    } else {
      setUpload('');
    }
  }, [propertySetting]);

  //api
  useEffect(()=>{

    // 배경 설정
    axios.get(
      process.env.REACT_APP_API_KEY+'Admin/Menu/data?code=property',
      config
    )
    .then((result)=>{
      // console.log("property 배경:", result.data);
      setPropertySetting(result.data.RECORD);
    });


    // 메뉴 설정
    axios.get(
      process.env.REACT_APP_API_KEY+'Admin/FunctionMenu/data',
      config
    )
    .then((result)=>{
      // console.log("function menu:", result.data);
      setFunctionMenuSetting(result.data.RECORD);
    });


  },[]);

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

  //메뉴 카테고리명
  const category = {
    "기본 정보": ["property_name", "building_name"],
    "주소 정보": ["addr_sido", "addr_sigungu", "addr_dong", "addr_road"],
    "매물 정보": [
      "supply_area",
      "exclusive_area",
      "total_floor",
      "current_floor",
      "room_count",
      "bathroom_count",
      "parking_available",
      "parking_count",
      "completion_date",
      "move_in_date",
      "direction",
      "heating_type",
      "heating_fuel",
    ],
    "가격 정보": [
      "sale_price",
      "jeonse_price",
      "deposit_price",
      "monthly_rent",
      "loan_amount",
      "maintenance_fee",
    ],
    "기타 정보": [
      "status",
      "display_yn",
      "summary",
      "description",
      "thumbnail_image",
      "detail_images",
    ],
  };

  // console.log(propertySetting);
  
  if(propertySetting && functionMenuSetting){
    return(<div id="propertySet">
      
       {/* 타이틀/버튼 */}
        <section className="grid">
          <div className="card homepage-set-title-btn">
            <h3>매물보기 페이지 설정</h3>
            <div className="btn-row">
              <div className="btn btn-muted" onClick={()=>{
                if(window.confirm('기본 설정을 초기화 시키시겠습니까?\n초기화 후 저장하여 홈페이지에 적용하시기 바랍니다.')){
                  $("input[type='text']").val('');
                  $("input[type='checkbox']").prop('checked', true);
                  $("input[name='main_menu_color']").val('#ffffff');
                  $("input[name='sub_menu_color']").val('#E72D2B');
                  $("input[name='bgcolor']").val('#f5f5f5');
                  $("input[name='transparent']").val(0);
                  $("#menu_back_transparent").text(0+"%");
                }
              }}>
                <span>초기화</span>
              </div>
              <div className="btn btn-primary" onClick={()=>{
                  // const this_form = $("form").attr("id");
                  // let whats = $("form").attr("data-whats");
                  if(window.confirm('저장하시겠습니까?')){
                    // 배경 저장
                    post_ajax(
                      "propertyBackground",
                      "menu",
                      config
                    );

                    // 메뉴 저장
                    post_ajax(
                      "propertySetting",
                      "property",
                      config
                    );
                    // dispatch(change_set(0));
                  }
                }}>
                <span>저장하기</span>
              </div>
            </div>
          </div>
          </section>

        <form id="propertyBackground" data-whats="menu">
          {/* 배경이미지 설정 (선택) */}
          <section className="grid">
            <div className="card">
              <div className="title-checkCon">
                <h3>배경 설정 (선택)</h3>
                <div className="check_con">
                  <label>
                    <input className="input_check_hidden" name="bgcolor_show" type="hidden" value='N'></input>
                    <input className="check_menu input_check" name="bgcolor_show" type="checkbox" value="Y" defaultChecked={propertySetting.row.bgcolor_show === "Y" ? true : false}></input>
                    <div className="check_btn">
                      <span className="disabled">숨김</span>
                      <span className="abled">보임</span>
                      <div className="circle"></div>
                    </div>
                  </label>
                </div>
              </div>
              <p className="sub">해당페이지 배경 이미지를 설정해주세요. / 이미지, 배경색 순으로 나타납니다. / 미입력시 기본값으로 적용</p>

              <div className="bg_img_con">
                <label>
                  <input type="file" name="file" onChange={(e)=>{
                    preview(e.target.files);
                    if(propertySetting.img !== null){
                      del_img(propertySetting.img, config);
                    }
                  }} accept="image/png, image/jpeg"></input>
                  <div className="upload_img">
                    {upload_logo_img === '' ? <img src="img/basic/notice/notice_base.jpg" alt="배경이미지"></img> : <img src={upload_logo_img} alt="배경이미지"></img>}
                  </div>

                  {
                  upload_logo_img === '' ? null : <div className="btn-minus" onClick={()=>{
                    if(propertySetting.img !== null){
                      del_img(propertySetting.img, config);
                    }
                    setUpload('');
                  }}>
                    <span><FontAwesomeIcon icon={faTrashCan}/></span>
                  </div>
                }
                </label>
                
                <div className="ex_con">
                  <div className="ex_rows">
                    <p className="card-content-tit">결과예시</p>
                    <img src="img/basic/notice/bgEx2.jpg" alt="결과예시"></img>
                  </div>
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
                      <input type="color" name="bgcolor" className="clr_input" defaultValue={propertySetting.row?.bgcolor || "#f5f5f5"}></input>
                    </div>

                    {/* 투명도 */}
                    <div className="card-content">
                      <p className="card-content-tit">투명도 <span id="menu_back_transparent">{propertySetting.row?.transparent || 0}%</span></p>
                      <div className="range_con">
                        <input type="range" name="transparent" className="opacity_input" min={0} max={100} defaultValue={propertySetting.row?.transparent || 0} onChange={(e)=>{
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

        </form>

        <form id="propertySetting" data-whats="property">
          <div className="grid">
            <div className="card">
              <div className="setting-container">
                {Object.entries(category).map(([categoryName, keys]) => (
                  <div className="setting-card" key={categoryName}>
                    <div className="card-header">
                      <h5>{categoryName}</h5>
                    </div>

                    <div className="card-body">
                      {functionMenuSetting
                        .filter(item => keys.includes(item.function_menu_key))
                        .map(item => (
                          <div className="setting-item" key={item.function_menu_no}>
                            <p className="item-label">{item.function_menu_name}</p>

                            <div className="check_con">
                              <label>
                                <input
                                  className="input_check_hidden"
                                  name={item.function_menu_key}
                                  type="hidden"
                                  value="N"
                                />

                                <input
                                  className="check_menu input_check"
                                  name={item.function_menu_key}
                                  type="checkbox"
                                  value="Y"
                                  defaultChecked={item.function_menu_value === "Y"}
                                />

                                <div className="check_btn">
                                  <span className="disabled">숨김</span>
                                  <span className="abled">보임</span>
                                  <div className="circle"></div>
                                </div>
                              </label>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }

}

export default Set_property;