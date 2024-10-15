<template>
  <div class="fit">
    <router-view />
    <!-- Footer ثابت في الأسفل -->
    <div
      v-if="!$route.path.includes('access')"
      class="bg-light row justify-center items-center"
    >
      <span class="text-grey-8">
        © {{ new Date().getFullYear() }}, Made by
      </span>
      <q-btn
        flat
        no-caps
        class="q-ml-xs q-px-sm text-caption text-blue-5"
        @click="()=>{$router.push({
        path: 'https://www.digitalpages.com'
      } as RouteLocationRaw)}"
        label="Digital Pages"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouteLocationRaw } from 'vue-router';
</script>
