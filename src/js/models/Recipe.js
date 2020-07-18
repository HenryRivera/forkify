import axios from 'axios'
import { key } from '../config'

export default class Recipe{
    constructor(id) {
        this.id = id
    }

    async getRecipe(){
        try{
            const res = await axios(`https://api.spoonacular.com/recipes/${this.id}/information?apiKey=${key}`)
            this.title = res.data.title
            this.author = res.data.sourceName
            this.img = res.data.image
            this.url = res.data.sourceUrl
            this.ingredients = res.data.extendedIngredients
            this.time = res.data.readyInMinutes
            this.servings = res.data.servings
            this.steps = res.data.instructions
            // console.log(res)
        }
        catch (e) {
            console.log(e)
            alert('Something went wrong!')
        }
    }

    parseIngredients(){
        const units = new Map();
        units.set('tablespoons', 'tbsp');
        units.set('tablespoon', 'tbsp');
        units.set('ounces', 'oz');
        units.set('ounce', 'oz');
        units.set('teaspoons', 'tspn');
        units.set('teaspoon', 'tspn');
        units.set('cups', 'cup');
        units.set('pounds', 'pound')
        units.set('grams', 'g')
        units.set('gram', 'g')
        units.set('kilograms', 'g')
        units.set('kilogram', 'g')

        const newIngredients = this.ingredients.map(curr => {
            // 1. Parse ingredients into count, unit, ingredient
            let objIng = {
                count: curr.amount,
                unit: curr.unit,
                ing: curr.name
            }

            // 2. Uniform units
            let u = curr.unit.toLowerCase()
            // console.log(`Old: ${u}`)
            units.forEach((value, key) =>{
                u = u.replace(key, value)
                objIng.unit = u
                // console.log(`New: ${u}`)
            })
            return objIng
        })
        this.ingredients = newIngredients
    }

    updateServings(type){
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1
        // Ingredients
        this.ingredients.forEach(ing =>{
            ing.count *= (newServings / this.servings)
            ing.count = Math.round(10 * ing.count) / 10
        })

        this.servings = newServings
    }
}