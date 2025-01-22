import {Router} from 'express';
import {
    // deletePlanet,
    getAllPlanets,
    getPlanetById,
    updatePlanet
} from '../controllers/planets.controller';
import {authenticate, authorize} from "../middleware/auth.middleware";

const router = Router();

router.get('/', getAllPlanets);
router.get('/:planetId', getPlanetById);
router.put('/:planetId', authenticate, authorize(['admin', 'council']), updatePlanet);
// router.delete('/:planetId', deletePlanet);

export default router;
