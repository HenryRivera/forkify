import { elements } from "./base";


export const getInput = () => elements.searchInput.value

export const clearInput = () => {
    elements.searchInput.value = ''
}

export const clearResults = () =>{
    elements.searchResList.innerHTML = ''
    elements.searchResPages.innerHTML = ''
}

export const highlightSelected = id =>{
    const highlighted = Array.from(document.querySelectorAll('.results__link'))
    highlighted.forEach(curr =>{
        curr.classList.remove('results__link--active')
    })
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active')
}

export const formatRecipeTitle = (title, limit = 17) =>{
    const formatted = []
    if (title.length > limit){
        title.split(' ').reduce((accum, curr) =>{
            if (accum + curr.length <= limit){
                formatted.push(curr)
            }
            return accum + curr.length
        }, 0)
        // return the result
        return `${formatted.join(' ')} ...`
    }
    return title
}

const renderRecipe = recipe =>{
    if (recipe.image){
        const link = "https://spoonacular.com/recipeImages/"
        const type = recipe.image.split('.')
        const source = link + recipe.id + "-" + "90x90." + type[1]
        const markup = `
        <li>
            <a class="results__link" href="#${recipe.id}">
                <figure class="results__fig">
                    <img src="${source}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${formatRecipeTitle(recipe.title)}</h4>
                    <p class="results__stats">Servings: ${recipe.servings}</p>
                    <p class="results__stats">Ready in: ${recipe.readyInMinutes} min</p>
                </div>
            </a>
        </li>
        `
        elements.searchResList.insertAdjacentHTML('beforeend', markup)
    }
}

// type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`

const renderButtons = (page, numResults, resPerPage) =>{
    const pages = Math.ceil(numResults / resPerPage)

    let button
    if (page === 1 && pages > 1){
        // Only button to go to next page
        button = createButton(page, 'next')
    }
    else if (page < pages){
        // both buttons
        button = `
            ${createButton(page, 'next')}
            ${createButton(page, 'prev')}
            `
    }
    else if (page === pages && pages > 1){
        // Only button to go to prev page
        button = createButton(page, 'prev')
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button)
}

export const renderResults = (recipes, page = 1, resPerPage = 10) =>{
    // render results of curr page
    const start = (page - 1) * resPerPage
    const end = page * resPerPage

    recipes.slice(start, end).forEach(renderRecipe)

    // render pagination buttons
    renderButtons(page, recipes.length, resPerPage)
}