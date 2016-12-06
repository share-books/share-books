<template>
<div class="event">
    <div class="label">
      <img :src="userIcon()">
    </div>
    <div class="content">
      <div class="summary">
        <a>{{userName()}}</a> {{eventName()}} <a>{{title()}}</a>
        <div class="date">
          {{eventTime() | timeAgo }}
        </div>
      </div>
   <div class="extra images">
        <img v-for="img in images()" :src="img">
      </div>
    </div>
</div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  replace: true,
  name: 'feed',
  data(){
      return {
          user:{},
          item:{},
          indexs:[
                {id:'',file:'av.png',text:'请选择'},
                {id:'1',file:'av-0.jpg',text:'IT男'},
                {id:'2',file:'av-1.jpg',text:'经理男'},
                {id:'3',file:'av-2.jpg',text:'时髦女'}
          ]
      }
  },
  props: {
    record: Object
  },
  async created(){
      this.user=await this.loadUser(this.record.uid)
      this.item=await this.loadItem(this.record.id)
  },
 
  
  methods:{
    ...mapActions(['loadItem','loadUser']),
    images(){
        let rt=this.item.images||[]
        return  rt.map(p => {
            if (p.startsWith('http'))
               return p
            return '/static/images/'+p
        })
    },
    userIcon(){
        console.log(this.user)
        if (!this.user||!this.user.photoURL)
          return '/static/images/av.png'
        let url=this.user.photoURL
        let cfg=this.indexs.find(p=>p.id==url)
      return url.startsWith('http')?
             url:'/static/images/'+cfg.file
    },
    userName(){
        return this.user.displayName
    },
    eventName(){
        return this.record.event
    },
    title(){
        return this.item.title
    },
    eventTime(){
        return this.item.time
    }
  }

}
</script>