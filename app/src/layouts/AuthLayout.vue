<template>
  <q-layout view="lHh Lpr lFf">
    <q-img src="src/assets/image.png" spinner-color="white" class="fullscreen">
      <q-page-container class="fullscreen bg-transparent">
        <router-view />
      </q-page-container>
    </q-img>
  </q-layout>
</template>

<script setup lang="ts"></script>
<!-- <style>
.q-img__content > div {
  background: rgba(0, 0, 0, 0) !important;
}
</style> -->
