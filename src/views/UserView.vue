<template>
  <div class="user-view">
    <template v-if="user">
      <h1>User : {{ user.id }}</h1>
      <ul class="meta">
        <li><span class="label">Created:</span> {{ user.created | timeAgo }} ago</li>
        <li><span class="label">Karma:</span> {{user.karma}}</li>
        <li v-if="user.about" v-html="user.about" class="about"></li>
      </ul>
    
    </template>
  </div>
</template>

<script>


function fetchUser (store) {
  return store.dispatch('FETCH_USER', {
    id: store.state.route.params.id
  })
}

export default {
  name: 'user-view',
  computed: {
    user () {
      return this.$store.state.users[this.$route.params.id]
    }
  },
  preFetch: fetchUser,
  beforeMount () {
    fetchUser(this.$store)
  }
}
</script>
