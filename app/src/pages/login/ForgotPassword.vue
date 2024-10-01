<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="row justify-center items-center q-pa-md">
        <q-card class="login-card">
          <div class="text-h6 q-mt-md">
            <q-icon name="star" color="primary" size="40px" />Online Quiz System
          </div>
          <q-card-section class="text-center">
            <div class="text-subtitle2 q-mt-md">
              Welcome to Materialize! 👋
              <div class="text-caption q-mt-sm">
                Please sign-in to your account and start the adventure
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="onLogin" class="q-gutter-md">
              <q-input v-model="email" label="Email" type="email" dense outlined class="custom-input" />
              <q-input v-model="password" label="Password" type="password" dense outlined class="custom-input">
                <template v-slot:append>
                  <q-icon name="visibility" />
                </template>
              </q-input>

              <div class="row items-center q-gutter-sm">
                <q-checkbox v-model="rememberMe" label="Remember Me" dense />
                <q-btn flat label="Forgot Password?" color="primary" @click="showForgotPasswordDialog = true" class="text-right" />
              </div>

              <q-btn label="Login" color="primary" class="full-width q-mt-md" />
            </q-form>
          </q-card-section>

          <q-card-actions align="center" class="q-pt-none">
            <div>New on our platform?
              <q-btn flat label="Create an account" color="primary" @click="showRegisterDialog = true" />
            </div>
          </q-card-actions>
        </q-card>
      </q-page>

      <!-- Register Dialog -->
      <q-dialog v-model="showRegisterDialog">
        <q-card style="min-width: 400px;">
          <q-card-section>
            <div class="text-h6">Create Account - Online Quiz System</div>
            <div class="text-subtitle2">Updating user details will receive a privacy audit.</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit.prevent="onRegister" class="q-gutter-md">
              <q-input v-model="username" label="Username" required />
              <q-input v-model="email" label="Email" type="email" required />
              <q-input v-model="password" label="Password" type="password" required />
              <q-input v-model="confirmPassword" label="Confirm Password" type="password" required />

              <q-toggle v-model="isTeacher" label="Are you a teacher?" />

              <div class="row q-mt-md">
                <q-btn label="Create" color="primary" type="submit" class="full-width" />
                <q-btn flat label="Cancel" color="primary" @click="showRegisterDialog = false" class="full-width q-ml-md" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const showRegisterDialog = ref<boolean>(false);
const showForgotPasswordDialog = ref<boolean>(false);
const email = ref<string>('');
const password = ref<string>('');
const rememberMe = ref<boolean>(false);
const username = ref<string>('');
const confirmPassword = ref<string>('');
const isTeacher = ref<boolean>(false);

const onLogin = () => {
  console.log('Login with', { email: email.value, password: password.value });
};

const onRegister = (): void => {
  console.log('Register with', { username: username.value, email: email.value, isTeacher: isTeacher.value });
  showRegisterDialog.value = false;
};
</script>

<style scoped>
/* باقي الأكواد */
</style>
