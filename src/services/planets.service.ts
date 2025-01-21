import Planet from '../models/Planet';

export const getAllPlanets = async () => {
    return Planet.find();
};

export const getPlanetById = async (planetId: string) => {
    return Planet.find({planetId});
};

/*export const createPlanet = async (planetData: any) => {
    const planet = new Planet(planetData);
    return planet.save();
};*/

export const updatePlanet = async (planetId: string, planetData: any) => {
    return Planet.findOneAndUpdate(
        { planetId }, // Find the planet by planetId
        planetData,   // Update with the provided data
        { new: true } // Return the updated document
    );
};

/*export const deletePlanet = async (planetId: string) => {
    return Planet.findByIdAndDelete(planetId);
};*/
