import {Router} from 'express';
import {
    // deletePlanet,
    getAllPlanets,
    getPlanetById,
    updatePlanet
} from '../controllers/planets.controller';

const router = Router();

router.get('/', getAllPlanets);
router.get('/:planetId', getPlanetById);
router.put('/:planetId', updatePlanet);
// router.delete('/:planetId', deletePlanet);

export default router;
