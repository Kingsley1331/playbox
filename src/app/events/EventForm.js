import React from "react";
// import { connect } from "react-redux";
import { useForm, useFieldArray } from "react-hook-form";
import Scene from "../../../engine/scenes/scene";
import { Condition, Action } from "./EventFormComponents";
import { selectEventAction, updateRulesAction } from "../../actions/events";

const EventForm = ({
  rule,
  selectedShapeId,
  eventType,
  selectEvent,
  onUpdateRules,
}) => {
  /**TODO: place in new utility file e.g rulesAndFormIntegration.js  */
  const applyRule = (ruleData) => {
    const logicalOperatorArray = [];
    const emitterLogicalOperatorArray = [];
    const receiverLogicalOperatorArray = [];
    const areConditionsSimple =
      ruleData.ruleType === "oneToOne" || ruleData.ruleType === "manyToOne";
    const triggeredFromOneShape =
      ruleData.ruleType === "oneToOne" || ruleData.ruleType === "oneToMany";
    let rule = { ...ruleData };
    for (let prop in ruleData) {
      if (
        prop === "conditions" ||
        prop === "emitterConditions" ||
        prop === "receiverConditions"
      ) {
        const conditions = ruleData[prop];
        const numOfCondtions = conditions.length;
        /**NOTE: can be refactored using technique in convertSceneRulesToFormRules*/
        for (let i = 0; i < numOfCondtions; i++) {
          const { logicalOperator } = conditions[i];
          if (prop === "conditions" && logicalOperator) {
            logicalOperatorArray.push(logicalOperator);
          }
          if (prop === "emitterConditions" && logicalOperator) {
            emitterLogicalOperatorArray.push(logicalOperator);
          }
          if (prop === "receiverConditions" && logicalOperator) {
            receiverLogicalOperatorArray.push(logicalOperator);
          }
        }
      }
    }
    if (areConditionsSimple) {
      rule.logicalOperators = logicalOperatorArray;
      rule.conditions = rule.conditions || [];
    } else {
      rule.emitterLogicalOperators = emitterLogicalOperatorArray;
      rule.receiverLogicalOperators = receiverLogicalOperatorArray;
      rule.emitterConditions = rule.emitterConditions || [];
      rule.receiverConditions = rule.receiverConditions || [];
    }
    if (triggeredFromOneShape) {
      rule.shapeId = selectedShapeId;
    }
    console.log("New Rule", rule);

    const rules = [...Scene.rules];
    const ruleIndex = rules.findIndex(({ id }) => id === rule.id);
    if (ruleIndex === -1) {
      Scene.rules.push(rule);
    } else {
      Scene.rules.splice(ruleIndex, 1, rule);
    }
  };

  const onSubmit = (ruleData) => {
    const { conditions } = ruleData;
    /** TODO: Find a better fix to the following problem: the form keeps converting the comparison value into a string */
    if (conditions && conditions.length) {
      const updatedCondtion = conditions.map((condition) =>
        (condition.propertyName === "id" ||
          condition.propertyName === "linewidth") &&
        condition.comparisonValue
          ? { ...condition, comparisonValue: Number(condition.comparisonValue) }
          : condition
      );
      ruleData.conditions = updatedCondtion;
    }
    /**Add id because form data doesn't have an id */
    applyRule({ ...ruleData, id: rule.id });
  };

  const { register, handleSubmit, watch, errors, control, setValue } = useForm({
    defaultValues: rule,
  });

  const watchAllFields = watch();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "conditions",
  });

  const {
    fields: emitterFields,
    append: emitterAppend,
    remove: emitterRemove,
  } = useFieldArray({
    control,
    name: "emitterConditions",
  });

  const {
    fields: receiverFields,
    append: receiverAppend,
    remove: receiverRemove,
  } = useFieldArray({
    control,
    name: "receiverConditions",
  });

  const {
    fields: actionFields,
    append: actionAppend,
    remove: actionRemove,
  } = useFieldArray({
    control,
    name: "actions",
  });
  console.log({ rule });
  console.log("watchAllFields", watchAllFields);
  const showSimpleConditions =
    watchAllFields.ruleType === "oneToOne" ||
    watchAllFields.ruleType === "manyToOne";

  const deleteRule = (ruleId) => {
    const deleteThisRule = window.confirm(
      "Are you sure you want to delete this rule"
    );
    if (deleteThisRule) {
      const sceneRules = [...Scene.rules];

      const filteredArray = sceneRules.filter(({ id }) => !(id === ruleId));
      Scene.rules = filteredArray;
      console.log({ filteredArray });
      onUpdateRules(filteredArray);
      return filteredArray;
    }
  };

  return (
    <div className="event-form_wrapper">
      <form className="event-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="button-holder">
          <button className="event-button" onClick={() => deleteRule(rule.id)}>
            Delete rule
          </button>
          <button className="event-button">Edit rule</button>
        </div>
        selectedShapeId: {selectedShapeId}
        <div className="form-types">
          <label>Event Type:</label>
          <select name="eventType" ref={register}>
            <option value="">none</option>
            <option value="collision">collision</option>
            <option value="drag">drag</option>
            <option value="click">click</option>
            <option value="hover">hover</option>
            <option value="double click">double click</option>
          </select>
          <label>Rule Type:</label>
          <select name="ruleType" ref={register}>
            <option value="oneToOne">oneToOne</option>
            <option value="manyToOne">manyToOne</option>
            <option value="oneToMany">oneToMany</option>
            <option value="manyToMany">manyToMany</option>
            <option value="oneToPartner">oneToPartner</option>
            <option value="manyToPartner">manyToPartner</option>
          </select>
        </div>
        <h3>Conditions</h3>
        {showSimpleConditions && (
          <Condition
            fields={fields}
            conditionType="conditions"
            append={append}
            remove={remove}
            register={register}
            selectedShapeId={selectedShapeId}
            setValue={setValue}
          />
        )}
        {!showSimpleConditions && (
          <div>
            <Condition
              title="Emitter"
              fields={emitterFields}
              conditionType="emitterConditions"
              append={emitterAppend}
              remove={emitterRemove}
              register={register}
              selectedShapeId={selectedShapeId}
              setValue={setValue}
            />
            <Condition
              title="Receiver"
              fields={receiverFields}
              conditionType="receiverConditions"
              append={receiverAppend}
              remove={receiverRemove}
              register={register}
              selectedShapeId={selectedShapeId}
              setValue={setValue}
            />
          </div>
        )}
        <h3>Actions</h3>
        <Action
          fields={actionFields}
          actionName="actions"
          append={actionAppend}
          remove={actionRemove}
          register={register}
        ></Action>
        <input type="submit" />
      </form>
    </div>
  );
};

const mapDispatchToProps = {
  selectEvent: selectEventAction,
  onUpdateRules: updateRulesAction,
};

const mapStateToProps = ({ event, selectedShape }) => {
  return {
    eventType: event,
    selectedShapeId: selectedShape,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(EventForm);
