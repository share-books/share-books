<template>
    <div>
       <div class="ui inline" :class="loading?'loader active ':''"></div>
        {{notify}}
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'notify',
  computed: mapGetters({
      loading: 'loading',
      notify: 'notifyMsg'
  })
}
</script>
