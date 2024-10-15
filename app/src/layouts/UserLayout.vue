<template>
  <q-layout style="background-color: #f2f2f2">
    <!-- Header -->
    <div class="column">
      <div
        class="col-auto bg-transparent q-pa-sm row justify-between items-center"
        style="height: 50px !important"
      >
        <span class="text-h5">Online Quiz System</span>
        <q-btn
          flat
          to="/"
          @click="
            () => {
              SessionUtil.logout();
            }
          "
          icon="logout"
        />
      </div>
      <q-card class="col-auto height-365 q-ma-md br-8">
        <q-card-section class="no-padding">
          <q-img src="../assets/image/image.png" class="br-t-8 h-250" />
        </q-card-section>

        <q-card-section class="row">
          <q-avatar class="col-auto q-pa-xs margin-t--50" size="128px" square>
            <q-img
              src="../assets/avatar/image.png"
              class="width-120 height-120"
            />
          </q-avatar>
          <div class="col column q-pa-sm">
            <div v-if="username" class="text-h5">{{ username.role }}</div>

            <div class="row justify-start items-center q-py-XS">
              <div v-if="username" class="text-body-1 text-weight-500">
                <q-icon
                  name="person"
                  size="sm"
                  style="color: #6d788d; font-size: 1.4em"
                />
                {{ username.username }}
              </div>
              <div v-if="username" class="text-body-1 text-weight-500 q-px-sm">
                <q-icon
                  name="email"
                  size="sm"
                  style="color: #6d788d; font-size: 1.4em"
                />
                {{ username.email }}
              </div>

              <q-space />
              <q-btn
                icon="notifications"
                size="sm"
                style="color: #6d788d; font-size: 1.2em"
                class="q-pb-sm"
                round
                flat
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-page-container class="full-width">
        <router-view />
      </q-page-container>
    </div>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { LocalStorage } from 'quasar';
import SessionUtil from 'src/util/SessionUtil';

const username = ref<{ username: string; email: string; role: string } | null>(
  null
);
onMounted(() => {
  const storedUser = LocalStorage.getItem('user');
  if (storedUser) {
    username.value = storedUser as {
      username: string;
      email: string;
      role: string;
    };
  }
});


</script>

<style scoped>
.bg-light {
  background-color: #f2f2f2;
}

.text-grey-8 {
  color: #8d8d8d;
}
.text-blue-5 {
  color: #3f51b5;
}
</style>
