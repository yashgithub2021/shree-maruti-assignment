import { Router } from "express";
import { addBlock, addCity, addRate, calculateRate, getCityBlock, getRates } from "./city-block.controller";

const router = Router()

//Post
router.post('/calculate-rate', calculateRate)
router.post('/add-city', addCity)
router.post('/add-block', addBlock)

//Get
router.get('/rates', getRates)
router.get('/city-blocks', getCityBlock)
router.post('/update-rates', addRate)

export default router