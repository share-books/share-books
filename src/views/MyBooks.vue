<template>
	<div class='example'>
		<div class="ui accordion">
			<div class="active title">
				<i class="dropdown icon"></i> 新增图书
			</div>
			<div class="active content">
				<add-book></add-book>
			</div>
		</div>
		<div class="ui divider"></div>
		<div class="ui top attached tabular menu" data-garbage="true">
			<a class="item active" data-tab="gird">表格模式</a>
			<a class="item" data-tab="card">卡片模式</a>
		</div>
		<div class="ui bottom attached tab segment active" data-tab="gird">
			<p class="ui text">
				Search <input name="query" v-model="searchQuery">
			</p>
			<my-grid :data="myBooks" :columns="gridColumns" :filter-key="searchQuery">
			</my-grid>
		</div>
		<div class="ui bottom attached tab segment" data-tab="card" data-garbage="true">
			<div class="ui animated fade button" tabindex="0" @click="right">
				<div class="visible content">上一个</div>
				<div class="hidden content">
					<i class="left long arrow icon"></i>
				</div>
			</div>
      <div class="ui animated fade button" tabindex="0" @click="left">
				<div class="visible content">下一个</div>
				<div class="hidden content">
					<i class="right long arrow icon"></i>
				</div>
			</div>


			<div class="ui  divider"></div>
			<div class="demo square ui shape ">
				<div class="sides">
					<div class="side active">
						<img src="/static/images/stevie.jpg" class="ui medium image">
					</div>
					<div class="side">
						<img src="/static/images/steve.jpg" class="ui medium image">
					</div>
				</div>
			</div>


		</div>
	</div>

</template>
<script>
import { mapGetters ,mapActions} from 'vuex'
import AddBook from '../components/AddBook.vue'
import MyGrid from '../components/MyGrid.vue'
export default {
 components: {AddBook,MyGrid},
 data() {
    return{
      searchQuery: '',
      gridColumns: ['title', 'keywords'],
      
   }
 },
 methods:{...mapActions(['getMyBooks']),
   left(){
      $('.shape').shape('flip left')
   },
   right(){
      $('.shape').shape('flip right')
   }
 }
 ,
 computed:mapGetters(['myBooks']),
 mounted() {
    $('.ui.accordion').accordion()
    $('.tabular.menu .item').tab()
    $('.ui.shape').shape()
		this.getMyBooks()
 }
 
}
  /*
    this.getMyBooks()
    let  $directionButton = $('.direction .button')
    let handler = {
    rotate: function() {
      let
        $shape    = $(this).closest('.example').find('.ui.shape'),
        direction = $(this).data('direction') || false,
        animation = $(this).data('animation') || false
      ;
      if(direction && animation) {
        $shape
          .shape(animation + ' ' + direction)
        ;
      }
    }

   
  };

  
  $directionButton
    .on('click', handler.rotate)
    .popup({
      delay     : 0,
      position  : 'bottom center'
    })
  ;
*/
</script>