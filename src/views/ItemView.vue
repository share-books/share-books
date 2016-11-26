<template>
  <div  v-if="item">
    <template v-if="item">
      <div>
        <a :href="item.url" target="_blank">
          <h2>{{ item.title }}</h2>
        </a>
        <span v-if="item.url" class="host">
          ({{ item.url | host }})
        </span>
        <p class="meta">
          {{ item.score }} points | by
          <router-link :to="'/user/' + item.uid">{{ item.by }}</router-link>
          {{ item.time | timeAgo }} ago
        </p>
      </div>
      <div class="">
        <p class="ui dividing header">
          {{ item.kids ? item.descendants + ' comments' : 'No comments yet.'}}
        </p>
        <ul v-if="item.kids" class="comment-children">
          <comment v-for="id in item.kids" :id="id"></comment>
        </ul>
      </div>
      <form class="ui reply form">
        <div class="field">
          <textarea ></textarea>
        </div>
        <div class="ui blue labeled submit icon button">
          <i class="icon edit"></i> 回复
        </div>
      </form>
    </template>
  </div>
</template>

<script>

import Comment from '../components/Comment.vue'

function fetchItem (store) {
  return store.dispatch('FETCH_ITEMS', {
    ids: [store.state.route.params.id]
  })
}

// recursively fetch all descendent comments
function fetchComments (store, item) {
  if (item.kids) {
    return store.dispatch('FETCH_ITEMS', {
      ids: item.kids
    }).then(() => Promise.all(item.kids.map(id => {
      console.log(id)
      return fetchComments(store, store.state.items[id])
    })))
  }
}

function fetchItemAndComments (store) {
  return fetchItem(store).then(() => {
    const { items, route } = store.state
    return fetchComments(store, items[route.params.id])
  })
}

export default {
  name: 'item-view',
  components: { Comment },
  data () {
    return {
      loading: true
      
    }
  },
  computed: {
    item () {
      let item=this.$store.state.items[this.$route.params.id]
      //console.log(item)
      return item
    }
  },
  
  // on the server, only fetch the item itself
 // preFetch: fetchItem,
  // on the client, fetch everything
  beforeMount () {
    fetchItemAndComments(this.$store).then(() => {
      this.loading = false
    })
  }
}
</script>