export function commaonLoader(value) {
  return dispatch => {
    dispatch({type: 'COMMON_LOADER', value: value});
  };
}
