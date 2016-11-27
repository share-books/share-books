import ItemList from '../components/ItemList.vue'

// This is a factory function for dynamically creating root-level list views,
// since they share most of the logic except for the type of items to display.
// They are essentially higher order components wrapping ItemList.vue.
export function createListView (type) {
  return {
    name: `${type}-books-view`,
    /*
    preFetch (store) {
      return store.dispatch('FETCH_LIST_DATA', { type })
    },*/
    render (h) {
      return h(ItemList, { props: { type }})
    }
  }
}
