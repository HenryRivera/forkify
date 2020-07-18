import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
import * as searchView from './views/searchView'
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likesView from './views/likesView'
import { elements, renderLoader, clearLoader } from "./views/base";



/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - liked recipes
 */
const state = {}


/** SEARCH CONTROLLER*/
const controlSearch = async () =>{
    // 1. Get query from view
    // console.log(query)
    const query = searchView.getInput()


    if (query){
        // 2. New search object and add to state
        state.search = new Search(query)

        // 3. Prepare UI for results
        searchView.clearInput()
        searchView.clearResults()
        renderLoader(elements.searchRes)

        try{
            // 4. Search for recipes
            await state.search.getResults()

            // 5. render results on UI
            console.log(state.search.result)
            clearLoader()
            searchView.renderResults(state.search.result)
        }
        catch (e) {
            alert(`Error processing search: ${e}`)
            clearLoader()
        }
    }
}


elements.searchForm.addEventListener('submit', event =>{
    event.preventDefault()
    controlSearch()
})

elements.searchResPages.addEventListener('click', event =>{
    const btn = event.target.closest('.btn-inline')
    if (btn){
        const goToPage = parseInt(btn.dataset.goto, 10)
        searchView.clearResults()
        searchView.renderResults(state.search.result, goToPage)
    }
})



/** RECIPE CONTROLLER*/
const controlRecipe = async () =>{
    // Get ID from the URL
    // location is entire url
    const id = window.location.hash.replace('#', '')
    // console.log(id)

    if (id){
        // Prepare the UI for changes
        recipeView.clearRecipe()
        renderLoader(elements.recipe)

        // Highlight selected search item
        if (state.search){
            searchView.highlightSelected(id)
        }

        // Create new recipe object
        state.recipe = new Recipe(id)

        try{
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe()
            state.recipe.parseIngredients()
        }
        catch (e) {
            alert(`Error processing recipe: ${e}`)
        }

        // Render recipe
        // console.log(state.recipe)
        clearLoader()
        recipeView.renderRecipe(state.recipe, state.likes.isLiked(id))
    }
}

// window.addEventListener('hashchange', controlRecipe)
// window.addEventListener('load', controlRecipe)
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe))

/** LIST CONTROLLER*/
const controlList = () =>{
    // Create a new list IFF there is none yet
    if (!state.list){
        state.list = new List()
    }

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(curr =>{
        const item = state.list.addItem(curr.count, curr.unit, curr.ing)
        listView.renderItem(item)
    })
}

// handle delete and update list item events
elements.shopping.addEventListener('click', evt => {
    const id = evt.target.closest(".shopping__item").dataset.itemid

    // Handle the delete button
    if (evt.target.matches(".shopping__delete, .shopping__delete *")){
        // Delete from state
        state.list.deleteItem(id)

        // Delete from UI
        listView.deleteItem(id)
    }

    // Handle the count update
    else if (evt.target.matches(".shopping__count__val")){
        const val = parseFloat(evt.target.value, 10)
        state.list.updateCount(id, val)
    }
})

/** LIKE CONTROLLER*/
const controlLike = () =>{
    if (!state.likes){
        state.likes = new Likes()
    }

    const currID = state.recipe.id
    const title = state.recipe.title
    const author = state.recipe.author
    const img = state.recipe.img

    // User has not yet liked curr recipe
    if (!state.likes.isLiked(currID)){
        // Add like to the state
        const newLike = state.likes.addLike(currID, title, author, img)

        // Toggle like button
        likesView.toggleLikeBtn(true)

        // Add like to the UI list
        likesView.renderLike(newLike)
    }
    else{ // User has liked curr recipe
        // Remove like from the state
        state.likes.deleteLike(currID)

        // Toggle like button
        likesView.toggleLikeBtn(false)

        // Remove like from the UI list
        likesView.deleteLike(currID)
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes())
}

// Restore liked recipes on page load
window.addEventListener('load', () =>{
    state.likes = new Likes()

    // Restore likes
    state.likes.readStorage()

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes())

    // Render existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like))
})


// handling recipe button clicks
elements.recipe.addEventListener('click', evt => {
    if (evt.target.matches('.btn-decrease, .btn-decrease *')){
        // Decrease button is clicked
        if (state.recipe.servings >= 1){
            state.recipe.updateServings('dec')
            recipeView.updateMeasurements(state.recipe)
        }
    }
    else if (evt.target.matches('.btn-increase, .btn-increase *')){
        // Increase button is clicked
        state.recipe.updateServings('inc')
        recipeView.updateMeasurements(state.recipe)
    }
    else if (evt.target.matches('.recipe__btn__add, .recipe__btn__add *')){
        // Add ingredients to shopping list
        controlList()
    }
    else if (evt.target.matches('.recipe__love, .recipe__love *')){
        // Like controller
        controlLike()
    }
})

