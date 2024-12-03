// export function addRulesAction(rules) {
//   return {
//     type: "ADD_RULES",
//     payload: rules,
//   };
// }
export function updateRulesAction(rules) {
  return {
    type: "UPDATE_RULES",
    payload: rules
  };
}
export function addGlobalRulesAction(rules) {
  return {
    type: "ADD_GLOBAL_RULES",
    payload: rules
  };
}
export function selectEventAction(eventType) {
  return {
    type: "SELECT_EVENT",
    payload: eventType
  };
}
export function selectGlobalEventAction(eventType) {
  return {
    type: "SELECT_GLOBAL_EVENT",
    payload: eventType
  };
}
