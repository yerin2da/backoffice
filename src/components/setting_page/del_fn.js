import axios from "axios";

function del_img(imgs, config){
  let formData = new FormData();
  formData.append('img_no', imgs[0].img_no);
  axios.post(process.env.REACT_APP_API_KEY+'Admin/Menu/file_del', formData, config).then((result)=>{
    // console.log(result.data);
  }).catch(()=>{
    alert("데이터 전송이 실패하였습니다.");
  });
}

export default del_img;