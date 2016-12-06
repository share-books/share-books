<template>
  <div>
    <div class="ui vertical masthead inverted  segment">
        <h5 class="ui header">
            我拥有一本已看完的《亲爱的安德烈》。<br> 你--我的朋友，却不知道。
            <br> 不知什么时候起，你迷上了这本书，费劲心思跑去图书馆借。
            <br> 没借到，又去书店买.
            <br> 如果你当初知道我有这本书，情况就不同了。
            <br> 可以省下很多时间和精力:-)
            <br>
            <br>

        </h5>

    </div>
    <div class="ui vertical masthead center aligned  segment">
        <div class="ui text container">
            <h3 class="ui header">
                图书交流小助手<br>Books Share
            </h3>

           <div class="ui steps tablet stackable">
               <div class="step active">
                  <i class="truck icon"></i>
                  <div class="content">
                    <div class="title">浏览</div>
                    <div class="description">查找图书</div>
                  </div>
              </div>
              <div class="step">
                  <i class="alarm icon"></i>
                  <div class="content">
                    <div class="title">注册</div>
                    <div class="description">注册借书</div>
                  </div>
              </div>
               <div class="step">
                  <i class="dashboard icon"></i>
                  <div class="content">
                    <div class="title">贡献</div>
                    <div class="description">登记图书</div>
                  </div>
              </div>
               <div class="step">
                  <i class="comments icon"></i>
                  <div class="content">
                    <div class="title">分享</div>
                    <div class="description">共同进步</div>
                  </div>
              </div>
           
            </div>
            <div class="ui huge primary button" @click='login()'>Get Started <i class="right arrow icon"></i></div>
        </div>
    </div>

    <div class="ui inverted vertical footer center aligned segment">
        <div class="ui container">
            <div class="ui stackable inverted divided equal height stackable grid">
                <div class="six wide column">
                    <h5 class="ui inverted header">感谢</h5>
                    <div class="ui inverted link list">
                        <a href="http://vuejs.org/" class="item" target="_blank">Vue.js</a>
                        <a href="http://www.wilddog.com" class="item" target="_blank">Wilddog</a>
                    </div>
                </div>
                <div class="six wide column">
                    <h5 class="ui inverted header">联系我们</h5>
                    <div class="ui inverted link list">
                        <a href="http://github.com/share-book" class="item" target="_blank">Judy(13710711847@163.com)</a>
                        <a href="http://github.com/lshengjian" class="item" target="_blank">Alex(lsj178@139.com)</a>

                    </div>
                </div>

            </div>
        </div>
    </div>
</div>
</template>

<script>
   // import MyImage from '../components/MyImage.vue'
   export default {
  /*   components: {
       MyImage
     },*/
        methods:{
            login(){
               
                this.$router.push('/login')
            }
        }
  
  }
  </script>

<style type="text/css">
    .masthead.segment {
        min-height: 300px;
        padding: 1em 0em;
    }
    
    .masthead h5.ui.header {
        margin-top: 2em;
        margin-bottom: 2em;
        font-size: 1.5em;
        font-weight: normal;
    }
    
    .masthead .ui.menu .ui.button {
        margin-left: 0.2em;
    }
    
    .masthead h3.ui.header {
        margin-top: 2em;
        margin-bottom: 1em;
        font-size: 3em;
        font-weight: normal;
    }
    
    .footer.segment {
        padding: 5em 0em;
    }
</style>