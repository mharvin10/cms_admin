<template>
  <v-app>
    <router-view/>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      //
    }
  },
  created () {
    this.axios.get('/admin/user')
      .then(response => {
        // console.log(response.data)
      })
      .catch(error => {
        console.log(error.response)
      })
  },
  name: 'App'
}
</script>

<style>
  .fr-view li {
    margin-left: 15px;
    padding-left: 5px;
  }
  a[href="https://froala.com/wysiwyg-editor"],
  a[href="https://www.froala.com/wysiwyg-editor?k=u"] {
    display: none !important;
    position: absolute;
    top: -99999999px;
  }
  #vue2-editor {
    height: 500px;
  }
</style>
