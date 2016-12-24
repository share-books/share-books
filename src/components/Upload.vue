<template>
    <div id="container">
        <input id="fileselect" name="files[]" type="file" />
        <div v-show="going" class="ui active progress" id="uploadbar">
            <div class="bar">
                <div class="progress"></div>
            </div>
        </div>
        <div class="ui four column grid">
            <div class="column" v-for="img in imgs">
                <img :src="img" class="ui  image">
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import Uploader from '../util/qiniu';
    // import api from '../api'
    import cfg from '../../config/app'
    //medium circular
    export default {
      replace: true,
      props: {
           // filenames: Array,
            filesLimit:Number,
            fileSize:Number
      },
      data() {
      //      console.log(process.env.NODE_ENV)
         return {
              imgs: [],
              going: false,
              upload_token: cfg.QINIU.TOKEN
         }

       },
       computed: mapGetters(['myInfo']),

        mounted() {
            $('#fileselect').filer({
                //showThumbs: true,
                //addMore: true,
                limit: this.filesLimit,
                fileMaxSize: this.fileSize,
                allowDuplicates: false,
                extensions: ["jpg", "jpeg","png", "gif"],
                captions: {
                    button: "选择图像文件",
                    feedback: "选择了文件，准备上传",
                    feedback2: "个文件被选中",
                    removeConfirmation: "确定要移除该文件?",
                    errors: {
                        filesLimit: "只允许上传{{fi-limit}}个文件。",
                        filesType: "只允许上传图片文件。",
                        filesSize: "{{fi-name}} 太大，请不要超过 {{fi-fileMaxSize}}MB。",
                        filesSizeAll: "全部文件的总大写超过限制{{fi-maxSize}}MB。",
                        folderUpload: "不支持上传目录。"
                    }
                },
                dialogs: {
                    alert: function (text) {
                        return alert(text);
                    },
                    confirm: function (text, callback) {
                        confirm(text) ? callback() : null;
                    }
                }
            });
            let input = document.getElementById('fileselect');
            let self = this
            input.addEventListener('change', e => {
                let total = input.files.length
                let cnt = 0
                self.imgs = []
               // console.log(total)
                for (let i = 0; i < total; i++) {
                    let file = input.files[i];
                    let uptoken = {
                        uptoken: this.upload_token, //七牛上传凭证
                        key: new Buffer(self.myInfo.phone + '-' + file.name).toString('base64') //base64字符串，new Buffer(key).toString('base64')
                    }
                    // console.log(file);
                    let uploader = new Uploader(file, uptoken);

                    uploader.on('progress', e => {
                        console.log(uploader.percent); //加载进度
                        console.log(uploader.offset); //字节
                        let p=uploader.percent
                        if (total>1)
                           p=cnt/total+p/total
                        $('#uploadbar').progress({ percent: p * 100 });
                        self.going = true
                    })
                    uploader.on('complete', e => {
                       cnt += 1
                       if (cnt == total)
                          self.going = false

                    })
                    uploader.upload().then(imgRes => {
                        //console.log(imgRes.key);
                        self.imgs.push(cfg.QINIU.DOMAIN + imgRes.key)
                        self.$emit('uploaded',self.imgs)
                        
                    })

                }

            })

        }
    }
  
</script>