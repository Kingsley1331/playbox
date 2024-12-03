import ShapesController from '../../shapes/ShapesController';
import findImpulse from '../forces/findImpulse';
import findVelocities from '../motion/findVelocities';
import averageData from './averageData';

const collisionHandler = (collidingShapesData, shapeAIndex) => {

    // console.log('collidingShapesData', collidingShapesData);
    // console.log('shapeAIndex', shapeAIndex);

    for (let collidingShape in collidingShapesData){
        // console.count('collisionHandler');
        const data = averageData(collidingShapesData[collidingShape]);
        // console.log('averageData', data)
        var centreOfMassA = ShapesController.getCentreOfMass(shapeAIndex);
        var centreOfMassB = ShapesController.getCentreOfMass(collidingShape); //collidingShape = shapeBIndex

        var velocityA = ShapesController.getProperty(shapeAIndex, 'velocity', true);
        var velocityB = ShapesController.getProperty(collidingShape, 'velocity', true);

        var angularVelocityA = ShapesController.getProperty(shapeAIndex, 'angularVelocity', true);
        var angularVelocityB = ShapesController.getProperty(collidingShape, 'angularVelocity', true);

        const velocities = {
            velocityA,
            velocityB,
            angularVelocityA,
            angularVelocityB
        }

        var massA = ShapesController.getProperty(shapeAIndex, 'mass', true);
        var massB = ShapesController.getProperty(collidingShape, 'mass', true);

        var momentOfInertiaA = ShapesController.getProperty(shapeAIndex, 'momentOfInertiaCOM', true);
        var momentOfInertiaB = ShapesController.getProperty(collidingShape, 'momentOfInertiaCOM', true);
        var unitNormal = data.unitNormal;
        var masses = { massA: massA, massB: massB, momentOfInertiaA: momentOfInertiaA, momentOfInertiaB: momentOfInertiaB };
        var centres = { centreA: centreOfMassA, centreB: centreOfMassB };

        const newVelocity = findVelocities(data, masses, centres, velocities, findImpulse);
        const newVelocityA = newVelocity.linearA;
        const newVelocityB = newVelocity.linearB;
        const newAngularVelocityA = newVelocity.angularA;
        const newAngularVelocityB = newVelocity.angularB;

        console.log('newVelocityA', newVelocityA);
        console.log('newVelocityB', newVelocityB);
        console.log('newAngularVelocityA', newAngularVelocityA);
        console.log('newAngularVelocityB', newAngularVelocityB);

        ShapesController.setProperty(shapeAIndex, 'velocity', newVelocityA, true);
        ShapesController.setProperty(shapeAIndex, 'angularVelocity', newAngularVelocityA, true);

        ShapesController.setProperty(collidingShape, 'velocity', newVelocityB, true);
        ShapesController.setProperty(collidingShape, 'angularVelocity', newAngularVelocityB, true);
    }
}

export default collisionHandler;