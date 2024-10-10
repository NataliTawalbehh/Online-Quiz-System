<template>
  <div class="fixed-center">
    <q-card class="br-12 width-460">
      <q-form @submit.prevent="onLogin">
        <q-card-section class="row justify-center text-center w-242 text-black">
          <div class="text-h6 q-mt-md w-192 row items-center">
            <q-icon
              name="star"
              color="primary"
              class="icon-stars w-42 text-lg"
            />
            <span class="q-px-sm"> Online Quiz System </span>
          </div>
          <div class="text-subtitle2 full-width q-mt-md">
            Welcome to Materialize! 👋
          </div>
          <div class="text-caption full-width q-mt-sm">
            Please sign-in to your account and start the adventure
          </div>
        </q-card-section>

        <q-card-section class="column items-center">
          <div>
            <q-input
              v-model="email"
              label="Email"
              type="email"
              dense
              outlined
              class="custom-input q-mt-sm"
            />
            <q-input
              v-model="password"
              label="Password"
              type="password"
              dense
              outlined
              class="custom-input q-mt-sm"
            >
              <template v-slot:append>
                <q-icon name="visibility" class="icon-icon" />
              </template>
            </q-input>
          </div>
          <div class="row justify-between full-width">
            <q-checkbox
              v-model="rememberMe"
              label="Remember Me"
              dense
              class="text-black"
            />

            <q-btn flat no-caps label="Forgot Password?" color="primary" />
          </div>
          <div class="full-width">
            <q-btn
              no-caps
              unelevated
              label="Login"
              color="primary"
              class="full-width q-mt-md"
              type="submit"
            />
          </div>
        </q-card-section>

        <q-card-section class="row items-center justify-around">
          <span class="text-black">New on our platform?</span>
          <q-btn
            flat
            no-caps
            label="Create an account"
            color="primary"
            @click="showRegisterDialog = true"
          />
        </q-card-section>
      </q-form>
    </q-card>
  </div>
  <!-- Register Dialog -->
  <q-dialog v-model="showRegisterDialog">
    <q-card class="register-card w-900">
      <q-form @submit.prevent="onRegister">
        <q-card-section class="row justify-end">
          <q-icon
            name="close"
            @click="showRegisterDialog = false"
            class="float-right"
          />
        </q-card-section>

        <q-card-section class="column items-center">
          <div class="text-h9">
            Create Account in
            <span style="color: #666cff">Online Quiz System</span>
          </div>
          <div class="text-body1 q-mt-sm" style="font-size: 15px">
            Updating user details will receive a privacy audit.
          </div>
        </q-card-section>
        <q-card-section class="row justify-center items-center">
          <q-input
            v-model="username"
            label="Username"
            dense
            outlined
            class="width-772 q-mt-md"
          />
          <q-input
            v-model="email"
            label="Email"
            type="email"
            dense
            outlined
            class="width-772 q-mt-md"
          />
          <q-input
            v-model="password"
            label="Password"
            type="password"
            dense
            outlined
            class="width-772 q-mt-md"
          />
          <q-input
            v-model="confirmPassword"
            label="Confirm Password"
            type="password"
            dense
            outlined
            class="width-772 q-mt-md"
          />
        </q-card-section>
        <q-toggle
          v-model="isTeacher"
          label="Are you a teacher?"
          class="q-mt-sm q-ml-xl"
        />
        <div class="row justify-end q-mb-xl q-mr-xl">
          <q-btn
            label="Create"
            color="primary"
            type="submit"
            class="q-mr-sm w-93 rounded-lg"
          />
          <q-btn
            flat
            label="Cancel"
            color="primary"
            @click="showRegisterDialog = false"
            class="w-93 rounded-lg"
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { LocalStorage } from 'quasar';

interface User {
  username: string;
  email: string;
  password: string;
  isTeacher: boolean;
  role: 'student' | 'teacher';
}

const router = useRouter();
const showRegisterDialog = ref<boolean>(false);
const email = ref<string>('');
const password = ref<string>('');
const rememberMe = ref<boolean>(false);
const username = ref<string>('');
const confirmPassword = ref<string>('');
const isTeacher = ref<boolean>(false);

const onLogin = () => {
  const users: User[] = LocalStorage.getItem('users') || [];

  const user = users.find((u: User) => u.email === email.value && u.password === password.value);

  if (user) {
    const userRole = user.isTeacher ? 'Teachers' : 'Students';
    LocalStorage.set('user', user);

    if (userRole === 'Students') {
      router.push({ path: '/student/quize' });
    } else if (userRole === 'Teachers') {
      router.push({ path: '/teacher/quiz' });
    }
  } else {
    console.log('Invalid credentials');
  }
};

const onRegister = (): void => {
  const users: User[] = LocalStorage.getItem('users') || [];


  const existingUser = users.find((u: User) => u.email === email.value);

  if (existingUser) {
    console.log('User already exists');
    return;
  }


  const newUser: User = {
    username: username.value,
    email: email.value,
    password: password.value,
    isTeacher: isTeacher.value,
    role: isTeacher.value ? 'teacher' : 'student',
  };

  users.push(newUser);
  LocalStorage.set('users', users);

  console.log('User registered:', newUser);
  showRegisterDialog.value = false;
};
</script>

<style scoped>
.custom-input {
  width: 364px;
  height: 48px;
  gap: 0px;
  opacity: 1;
}
</style>
