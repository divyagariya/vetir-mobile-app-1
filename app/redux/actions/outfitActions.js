import {NoAuthAPI} from '../../services';

export function addOutfit(data) {
  return async dispatch => {
    const apiResponse = await NoAuthAPI('createOutfit', 'POST', data);
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'ADD_OUTFIT', value: apiResponse});
    }
  };
}

export function editOutfit(data) {
  return async dispatch => {
    const apiResponse = await NoAuthAPI('editOutfitDetails', 'POST', data);
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'EDIT_OUTFIT', value: apiResponse});
    }
  };
}

export function getOutfitsList() {
  return async (dispatch, getState) => {
    const apiPath = `getOutfitDetails?userId=${getState().AuthReducer.userId}`;
    const apiResponse = await NoAuthAPI(apiPath, 'GET');
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'GET_OUTFIT', value: apiResponse?.outfitList});
    }
  };
}

export function getOutfitDetail(data) {
  return async dispatch => {
    const apiResponse = await NoAuthAPI('getOneOutfitDetails', 'POST', data);
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'OUTFIT_DETAILS', value: apiResponse?.outfitList[0]});
    }
  };
}

export function deleteOutfit(data) {
  return async dispatch => {
    const apiResponse = await NoAuthAPI('removeOutfitItem', 'POST', data);
    if (Object.keys(apiResponse).length) {
      dispatch({type: 'OUTFIT_DELETE', value: apiResponse});
    }
  };
}

export function findOutfitList(data) {
  return async dispatch => {
    const apiResponse = await NoAuthAPI('findOutfitList', 'POST', data);
    if (Object.keys(apiResponse).length) {
      console.log('list outfit api response ->', apiResponse);

      dispatch({type: 'FIND_OUTFIT_LIST', value: apiResponse?.outfitList});
    }
  };
}
