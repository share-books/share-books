import BookList from '../components/BookList.vue'

// This is a factory function for dynamically creating root-level list views,
// since they share most of the logic except for the type of items to display.
// They are essentially higher order components wrapping ItemList.vue.
export function createList (type) {
  return {
    name: `${type}-books`,
    render (h) {
      return h(BookList, { props: { type }})
    }
  }
}