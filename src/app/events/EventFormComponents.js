import React, { useEffect } from "react";
import { propertyMap, operatorsArray } from "../../../constants/events";

export const Condition = ({
  fields,
  conditionType,
  append,
  title,
  remove,
  register,
  selectedShapeId,
  setValue
}) => {
  /**TODO: get the setValue to work for all conditons instead of the just first and also only when the propertyName = 'id' */
  useEffect(() => {
    if (selectedShapeId) {
      setValue(`${conditionType}[0].comparisonValue`, selectedShapeId, {
        shouldValidate: true,
        shouldDirty: true
      });
    }
  }, [selectedShapeId, setValue]);

  return (
    <div>
      <div className="form-condition-group">
        <h4>{title}</h4>
        {fields.map((field, index) => (
          <div>
            <div key={field.id}>
              <div className="form-condition">
                {!!index && (
                  <div className="form-logical_operator">
                    <select
                      ref={register()}
                      name={`${conditionType}[${index}].logicalOperator`}
                      defaultValue={field.logicalOperator}
                    >
                      <option value="OR">OR</option>
                      <option value="AND">AND</option>
                      <option value="NOT">NOT</option>
                    </select>
                  </div>
                )}
                <label>Property name:</label>
                <select
                  ref={register()}
                  name={`${conditionType}[${index}].propertyName`}
                  defaultValue={field.propertyName}
                >
                  {Object.entries(propertyMap).map(prop => (
                    <option key={prop[0]} value={prop[0]}>
                      {prop[1]}
                    </option>
                  ))}
                </select>
                <label>Operator:</label>
                <select
                  ref={register()}
                  name={`${conditionType}[${index}].operator`}
                  defaultValue={field.operator}
                >
                  {operatorsArray.map(operator => (
                    <option key={operator[0]} value={operator[0]}>
                      {operator[1]}
                    </option>
                  ))}
                </select>
                <label>Comparison:</label>
                <input
                  ref={register()}
                  name={`${conditionType}[${index}].comparisonValue`}
                  defaultValue={field.comparisonValue}
                ></input>
                <button type="button" onClick={() => remove(index)}>
                  delete
                </button>
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={() => append({})}>
          Add condition
        </button>
      </div>
    </div>
  );
};

export const Action = ({ fields, actionName, append, remove, register }) => {
  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id}>
          <div className="form-action">
            <label>Property name:</label>
            <select
              ref={register()}
              name={`${actionName}[${index}].actionPropertyName`}
              defaultValue={field.actionPropertyName}
            >
              {Object.entries(propertyMap)
                .filter(prop => prop[0] !== "id")
                .map(prop => (
                  <option key={prop[0]} value={prop[1]}>
                    {prop[0]}
                  </option>
                ))}
            </select>
            <label>New Value:</label>
            <input
              ref={register()}
              name={`${actionName}[${index}].newValue`}
              defaultValue={field.newValue}
            ></input>
            <button onClick={() => remove(index)}>delete</button>
          </div>
        </div>
      ))}
      <br />
      <br />
      <button type="button" onClick={() => append({})}>
        Add Action
      </button>
    </div>
  );
};
