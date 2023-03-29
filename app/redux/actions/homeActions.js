import {NoAuthAPI} from '../../services';

export function getHomePageData() {
  return async (dispatch, getState) => {
    const apiResponse = await NoAuthAPI(
      `get/homePageData?userId=${getState().AuthReducer.userId}`,
      'GET',
    );
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'GET_HOME_DATA', value: apiResponse});
      dispatch({type: 'REFRESH_HOME', value: false});
    }
  };
}

export function getProductDetailsApi(productId) {
  return async (dispatch, getState) => {
    const apiResponse = await NoAuthAPI(
      `get/productDetails?productId=${productId}&userId=${
        getState().AuthReducer.userId
      }`,
      'GET',
    );
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'GET_PRODUCT_DETAILS', value: apiResponse});
    }
  };
}

export function getFilteredProducts(data) {
  return async (dispatch, getState) => {
    console.log('@@ data', data);
    const data1 = data;
    data1.userId = getState().AuthReducer.userId;
    let url = 'get/allProducts/v1';
    const apiResponse = await NoAuthAPI(url, 'POST', data1);
    console.log('@@ filter res', JSON.stringify(apiResponse, undefined, 2));
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
