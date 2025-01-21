import {Router, Request, Response} from 'express';
import * as PlanetService from '../services/planets.service';

const router = Router();

router.get(
    '/',
    async (req: Request, res: Response) => {
        const planets = await PlanetService.getAllPlanets();
        res.json(planets);
    }
);

router.get(
    '/:planetId',
    async (req: Request, res: Response) => {
        const {planetId } = req.params;
        const planet = await PlanetService.getPlanetById(planetId);
        if (!planet) res.status(404).json({ error: 'Planet not found' });
        res.json(planet);
    }
);

router.put(
    '/:planetId',
    async (req: Request, res: Response) => {
        const { planetId } = req.params;
        const updatedPlanet = await PlanetService.updatePlanet(planetId, req.body);
        if (!updatedPlanet) res.status(404).json({ error: 'Planet not found' });
        res.json(updatedPlanet);
    }
);

/*router.delete(
    '/:planetId',
    async (req: Request, res: Response) => {
        const deletedPlanet = await PlanetService.deletePlanet(req.params.id);
        if (!deletedPlanet) res.status(404).json({ error: 'Planet not found' });
        res.json({ message: 'Planet deleted successfully' });
    }
);*/

export default router;
