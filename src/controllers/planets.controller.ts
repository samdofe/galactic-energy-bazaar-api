import Planet from '../models/Planet';
import {Request, Response} from "express";
import {formatErrorMessage} from "../utils/utils";

export const getAllPlanets = async (req: Request, res: Response) => {
    try {
        const planets = await Planet.find();
        res.json(planets);
    } catch (error) {
        res.status(500).json(formatErrorMessage('Failed to fetch planets', error));
    }
}

export const getPlanetById = async (req: Request, res: Response) => {
    const {planetId } = req.params;
    try{
        const planet = await Planet.find({planetId});
        if (!planet) res.status(404).json(formatErrorMessage(`Planet ${planetId} not found!`));
        res.json(planet);
    }catch(error){
        res.status(500).json(formatErrorMessage(`Failed to fetch planet ${planetId}`, error));
    }
}

/*export const createPlanet = async (planetData: any) => {
    const planet = new Planet(planetData);
    return planet.save();
};*/

export const updatePlanet = async (req: Request, res: Response) => {
    const { params, body } = req;
    const {planetId} = params;

    try{
        const updatedPlanet = await Planet.findOneAndUpdate(
            { planetId }, // Find the planet by planetId
            body,   // Update with the provided data
            { new: true } // Return the updated document
        );
        if (!updatedPlanet) res.status(404).json(formatErrorMessage(`Planet ${planetId} not found!`));
        res.json(updatedPlanet);
    }catch(error){
        res.status(500).json(formatErrorMessage(`Failed to update planet ${planetId}`, error));
    }
}

/*
export const deletePlanet = async (req: Request, res: Response) => {
    const { planetId } = req.params;
    const deletedPlanet = await Planet.findOneAndDelete({planetId});
    if (!deletedPlanet) res.status(404).json({ error: 'Planet not found' });
    res.json({ message: 'Planet deleted successfully' });
}
*/
