<template>
    <div id="container">
        <form method="post" :action="posturl" enctype="multipart/form-data">
            <input name="key" type="hidden" :value="filename">
            <!-- <input name="x:<custom_name>" type="hidden" value="<custom_value>">-->
            <input name="token" type="hidden" :value="upload_token">
            <input name="file" type="file" />
            <input name="crc32" type="hidden" />
            <input name="accept" type="hidden" />
            <button type="submit">send</button>
        </form>
    </div>
</template>

<script>
//
//cfg.QINIU.DOMAIN
import cfg from '../../config/app'

export default {
    data(){
        return{
        posturl:(process.env.NODE_ENV !== 'production')
                 ?'http://upload.qiniu.com/':'https://up.qbox.me',
        filename:'my-dog.jpg',
        upload_token:cfg.QINIU.TOKEN
        }

    }
}
</script>