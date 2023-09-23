import {NoAuthAPI} from '../../services';

export function getAllClients() {
  return async (dispatch, getState) => {
    const apiResponse = await NoAuthAPI(
      `getStylistClients?personalStylistId=${getState().AuthReducer.userId}`,
      'GET',
    );
    console.log('apiResponse', apiResponse);
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'REFRESH_CLIENTS', value: false});
      dispatch({type: 'ALL_CLIENT_DATA', value: apiResponse.clientDetails});
    }
  };
}

export function addStylistAction(data) {
  return async (dispatch, getState) => {
    const apiResponse = await NoAuthAPI('addStylist', 'POST', data);
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'ADD_STYLIST', value: apiResponse});
    }
  };
}

export function deleteStylistAction(data) {
  return async (dispatch, getState) => {
    const apiResponse = await NoAuthAPI('removeStylist', 'POST', data);
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'DELETE_STYLIST', value: apiResponse});
    }
  };
}

export function recommendedAction(data) {
  return async (dispatch, getState) => {
    const apiResponse = await NoAuthAPI('recommendToClient', 'POST', data);
    console.log('recommendedAction', apiResponse);
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'RECOMMENDED_TO_CLIENTS', value: apiResponse});
    }
  };
}

export function recommendedProductsAction(id) {
  return async (dispatch, getState) => {
    const apiResponse = await NoAuthAPI(
      `getRecommendationToClient?personalStylistId=${
        getState().AuthReducer.userId
      }&userId=${id}`,
      'GET',
    );
    if (Object.keys(apiResponse).length) {
      dispatch({
        type: 'RECOMMENDED_PRODUCTS_CLIENTS',
        value: apiResponse.recommendedProductDetails,
      });
    }
  };
}

export function dislikeProductAction(data) {
  return async (dispatch, getState) => {
    const apiResponse = await NoAuthAPI('changeLikeStatus', 'POST', data);
    console.log('dislike', apiResponse);
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'DISLIKE_PRODUCTS', value: apiResponse});
    }
  };
}

export function getClientDetails(clientId) {
  return async dispatch => {
    const apiResponse = await NoAuthAPI(
      `getUserDetails?userId=${clientId}`,
      'GET',
    );
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'CLIENT_DETAILS', value: apiResponse});
    }
  };
}
