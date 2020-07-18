import uniqid from 'uniqid'

export default class List{
    constructor() {
        this.items = []
    }

    addItem(count, unit, ingredient){
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item)
        return item
    }

    deleteItem(id){
        const ind = this.items.findIndex(curr => curr.id === id)

        // mutates original array, unlike slice
        this.items.splice(ind, 1)
    }

    updateCount(id, newCount){
        this.items.find(curr => curr.id === id).count = newCount
    }
}