"use client";

import React from "react";
// import { connect } from "react-redux";
// import selectShape from "../../actions/buttons";
import selectShape1 from "../actions/buttons";
// import Scene, { updateSelected } from "../../../engine/scenes/scene";
import Scene, { updateSelected } from "../engine/scenes/scene";

import { ImgButton, BUTTONS } from "./buttons";

/**NOTE: Change confusing variable name selectShape refers to selecting features i.e clone, rotate etc */
const Buttons = ({ buttons, setSelected, setManagedShapeIndex }) => {
  return (
    <div className="buttons flex gap-x-5 my-1.5 ml-3">
      {BUTTONS.map(({ name, width = "25", onClick = () => {} }) => (
        <ImgButton
          key={name}
          alt={`${name} button`}
          id={name}
          src={`images/${name}.png`}
          width={width}
          selected={buttons[name]}
          setSelected={() => {
            if (Scene.selected === name) {
              setSelected("");
            } else {
              setSelected(name);
              setManagedShapeIndex(null);
            }
            onClick();
          }}
        />
      ))}
    </div>
  );
};

// const mapStateToProps = (state) => {
//   updateSelected(state, Scene);
//   return {
//     buttons: state.buttons,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     selectShape: (shape) => dispatch(selectShape(shape)),
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Buttons);
export default Buttons;
