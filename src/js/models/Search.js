import axios from 'axios'
import { key } from '../config'

export default class Search{
    constructor(query){
        this.query = query
    }
    async getResults(){
        const number = 30
        try{
            const ret = await axios(`https://api.spoonacular.com/recipes/search?apiKey=${key}&query=${this.query}&number=${number}`)
            this.result = ret.data.results
            // console.log(this.result)
        }
        catch (e) {
            alert(e)
        }
    }
}