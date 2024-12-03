const fixPropertyName = rules => {
  if (rules) {
    const length = rules.length;
    for (let i = 0; i < length; i++) {
      const rule = rules[i];
      const { conditions, actions } = rule;
      const numOfConditions = conditions.length;
      const numOfActions = actions.length;

      for (let j = 0; j < numOfConditions; j++) {
        const condition = conditions[j];
        const { propertyName } = condition;
        condition.propertyName = propertyName.replace("physics.", "");
      }
      for (let k = 0; k < numOfActions; k++) {
        const action = actions[k];
        const { actionPropertyName } = action;

        if (actionPropertyName) {
          action.actionPropertyName = actionPropertyName.replace(
            "physics.",
            ""
          );
        }
      }
    }
  }
  return rules;
};

export const retrieveLocalRules = (newRules, shapeId) => {
  let Rules = {};
  let selectedRules;
  const rulesForRedux = {};
  for (let eventType in newRules) {
    if (eventType !== "subscribed") {
      const { rules } = newRules[eventType];
      if (!Rules[eventType]) {
        Rules[eventType] = {};
      }
      if (!Rules[eventType][shapeId]) {
        Rules[eventType][shapeId] = rules;
        selectedRules = rules;
      }

      rulesForRedux[eventType] = {
        [shapeId]: [...fixPropertyName(selectedRules)]
      };
    }
  }

  return rulesForRedux;
};

export const retrieveGlobalRules = newRules => {
  let Rules = {};
  let selectedRules;
  const rulesForRedux = {};
  for (let eventType in newRules) {
    if (eventType !== "local") {
      /**TEMP */
      const { rules } = newRules[eventType];
      if (!Rules[eventType]) {
        Rules[eventType] = {};
      }
      if (Rules[eventType]) {
        Rules[eventType] = rules;
        selectedRules = rules;
      }
      rulesForRedux[eventType] = [...fixPropertyName(selectedRules)];
      console.log("Rules", [...fixPropertyName(selectedRules)]);
    }
  }

  return rulesForRedux;
};
