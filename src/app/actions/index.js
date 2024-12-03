import axios from 'axios';
import { FETCH_CURRENT_USER } from './types';

// export const fetchCurrentUser = () => {
//   return function(dispatch) {
//     axios
//       .get('/api/current_user')
//       .then(res => dispatch({type: FETCH_CURRENT_USER, payload: res.data}));
//   };
// };

export const fetchCurrentUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_CURRENT_USER, payload: res.data });
};
