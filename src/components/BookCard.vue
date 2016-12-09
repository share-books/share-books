<template>


	<div class="ui card" :id="item.id">
		<div class="ui dimmer">
			<div class="content">
				<div class="center">
					<h2 class="ui inverted icon  header">
						<i class="heart icon"></i> 资料保存成功!
					</h2>
				</div>
			</div>
		</div>
		<div class="content">
			<div class="right floated meta" data-garbage="true">{{ item.time | timeAgo }}</div>

			<img class="ui avatar image" src="/static/images/av-1.jpg">
			<router-link :to="'/user/' + item.by">{{ item.by }}</router-link>
		</div>
		<div class="image">
			<img src="/static/images/dog-1.jpg" alt="">
		</div>
		<div class="content">
			<p class="header">{{ item.title }}</p>
			<span class="right floated">
      
      <i class="heart outline like icon"></i>
       {{ item.likes&&item.likes.length }} 喜欢
    </span>
			<i class="comment icon" data-garbage="true"></i>
			<router-link :to="'/book/' + item.id">{{ item.kids&&item.kids.length }} 条评论</router-link>
		</div>
		<div class="extra content" v-if="authenticated">
			<div class="ui large transparent  input">

				<input type="text" placeholder="我要评价..." @keyup.13="addComment()" v-model="newComment">
			</div>
		</div>
	</div>


</template>

<script>
import { mapGetters ,mapActions} from 'vuex'

export default {
 // name: 'book-card',
  props: ['item'],
  data() {
    return { newComment:''}
  },
  created(){
    //$('#'+this.item.id).dimmer()
  },
  computed:mapGetters(['authenticated']),
  methods:{
    ...mapActions(['addItem']),
    addComment(){
     // addItem({title:this.newComment},this.item.id)
       console.log(this.newComment)
       this.addItem({
                title:this.newComment,
                parent:this.item.id
           
       }).then(()=>{
         this.newComment=''
         $('#'+this.item.id).dimmer('show')

       })
    }
  }
}
</script>