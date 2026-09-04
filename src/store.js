import { configureStore, createSlice } from '@reduxjs/toolkit';

let alt_log = createSlice({
  name : 'alt_log',
  initialState : false,
  reducers : {
      log_in_out(state){
        return !state
      }
  }
});

let now_idkey = createSlice({
  name : 'now_idkey',
  initialState : {
    id : '',
    login_key : ''
  },
  reducers : {
      set_idkey(state, a){
        return {id : a.payload[0], login_key : a.payload[1]}
      }
  }
});

let current_page = createSlice({
  name : 'current_page',
  initialState : '',
  reducers : {
      change_page(state, a){
        return a.payload
      }
  }
});

let current_set = createSlice({
  name : 'current_set',
  initialState : 0,
  reducers : {
      change_set(state, a){
        return a.payload
      }
  }
});

let snslist_cnt = createSlice({
  name : 'snslist_cnt',
  initialState : [
    
  ],
  reducers : {
      plus_list(state, obj){
        state.push(obj.payload);
      },

      minus_list(state, idx){
        state.splice(idx.payload, 1);
      },

      replace_list(state, obj){
        return state = obj.payload;
      }
  }
});

let sns_del = createSlice({
  name : 'sns_del',
  initialState : [
    
  ],
  reducers : {
      plus_del(state, obj){
        state.push(obj.payload);
      }
  }
});

let set_main_slide = createSlice({
  name : 'set_main_slide',
  initialState : '',
  reducers : {
      plus_Mslide(state, a){
        return state = a.payload
      },

      minus_Mslide(state, idx){
        state.splice(idx.payload, 1);
      }
  }
})

let set_around_slide = createSlice({
  name : 'set_around_slide',
  initialState : '',
  reducers : {
      plus_Aslide(state, a){
        return state = a.payload
      },

      minus_Aslide(state, idx){
        state.splice(idx.payload, 1);
      }
  }
})

let board_view_data = createSlice({
  name : 'board_view_data',
  initialState : '',
  reducers : {
      now_view(state, a){
        return state = a.payload
      }
  }
})

// 1. 매물 전용 슬라이스 생성
let property_view_data = createSlice({
  name : 'property_view_data',
  initialState : '',
  reducers : {
      // 매물 정보를 담아줄 액션명 (게시판과 구분되게!)
      now_property_view(state, a){
        return state = a.payload
      }
  }
});

export let {log_in_out} = alt_log.actions
export let {set_idkey} = now_idkey.actions
export let {change_page} = current_page.actions
export let {change_set} = current_set.actions
export let {plus_list, minus_list, replace_list} = snslist_cnt.actions
export let {plus_del} = sns_del.actions
export let {plus_Mslide, minus_Mslide} = set_main_slide.actions
export let {plus_Aslide, minus_Aslide} = set_around_slide.actions
export let {now_view} = board_view_data.actions
export let { now_property_view } = property_view_data.actions;

export default configureStore({
  reducer: {
      alt_log : alt_log.reducer,
      now_idkey : now_idkey.reducer,
      current_page : current_page.reducer,
      current_set : current_set.reducer,
      snslist_cnt : snslist_cnt.reducer,
      sns_del : sns_del.reducer,
      set_main_slide : set_main_slide.reducer,
      set_around_slide : set_around_slide.reducer,
      board_view_data : board_view_data.reducer,
      property_view_data : property_view_data.reducer 
  }
});