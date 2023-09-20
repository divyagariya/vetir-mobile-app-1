import {NoAuthAPI} from '../../services';

export function getHomePageData() {
  return async (dispatch, getState) => {
    let url = '';
    if (getState().AuthReducer.isStylistUser) {
      url = `get/homePageData?personalStylistId=${
        getState().AuthReducer.userId
      }`;
    } else {
      url = `get/homePageData?userId=${getState().AuthReducer.userId}`;
    }
    const apiResponse = await NoAuthAPI(url, 'GET');
    dispatch({type: 'REFRESH_HOME', value: false});
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'GET_HOME_DATA', value: apiResponse});
    }
  };
}

export function getProductDetailsApi(productId, id = '') {
  return async (dispatch, getState) => {
    let url = '';
    if (id) {
      url = `get/productDetails?productId=${productId}&personalStylistId=${
        getState().AuthReducer.userId
      }&userId=${id}`;
    } else {
      url = `get/productDetails?productId=${productId}&userId=${
        getState().AuthReducer.userId
      }`;
    }
    const apiResponse = await NoAuthAPI(url, 'GET');
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'GET_PRODUCT_DETAILS', value: apiResponse});
    }
  };
}

export function getVideoList(page = 1, limit = 10) {
  return async (dispatch, getState) => {
    const apiResponse = await NoAuthAPI(
      `videos?userId=${
        getState().AuthReducer.userId
      }&page=${page}&limit=${limit}`,
      'GET',
    );
    console.log('Videos', JSON.stringify(apiResponse, undefined, 2));
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'GET_VIDEO_LIST', value: apiResponse.videoData});
      dispatch({type: 'TOTAL_VIDEOS', value: apiResponse.totalCount || 0});
    }
  };
}

export function viewVideo(data) {
  return async (dispatch, getState) => {
    const apiResponse = await NoAuthAPI('video/view', 'POST', data);
    console.log('Videos view', apiResponse);
    if (Object.keys(apiResponse).length) {
      dispatch(getVideoList());
    }
  };
}

export function getFilteredProducts(data) {
  return async (dispatch, getState) => {
    const data1 = data;
    data1.userId = getState().AuthReducer.userId;
    let url = 'get/allProducts/v2';
    const apiResponse = await NoAuthAPI(url, 'POST', data1);
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'FILTERED_PRODUCTS', value: apiResponse});
    }
  };
}

export function getSearchResult(key) {
  return async dispatch => {
    const apiResponse = await NoAuthAPI(`search?key=${key}`, 'GET');
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'GET_SEARCH_RESULT', value: apiResponse});
    }
  };
}
