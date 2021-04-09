<template>
  <v-dialog v-model="props.show" content-class="transparent overlay overlay--active" fullscreen>
    <v-layout fill-height align-center justify-center column>
      <img :src="props.photoSrc" alt="" style="z-index:1">
      <v-btn small class="error" @click="props.show = false">Close</v-btn>
    </v-layout>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      props: Object
    }
  }
</script>
