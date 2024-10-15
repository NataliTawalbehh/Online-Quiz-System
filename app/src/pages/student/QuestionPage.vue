<template>
  <div
    v-if="quizName"
    class="column items-center q-px-xl"
    style="width: 70%; margin: auto"
    v-bind="$attrs"
  >
    <div
      class="full-width col-auto column justify-center items-center q-pa-sm"
    >

      <div class="color-text font-w font-size font-family">{{ quizName }}</div>

      <div class="row justify-end full-width q-mt-lg q-py-sm">

      </div>

    </div>


    <QuestionComp class="full-width" :quiz="quiz" />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import QuestionComp from 'src/components/student/quiz/QuestionComp.vue';
import GetQuizzesFun from 'src/functions/GetQuizzesFun';
import { Quiz } from 'src/models/QuizzesModel';

const route = useRoute();
const quizName = ref<string | null>(null);
const quizzes = ref<Quiz[]>([]);
const quiz = ref<Quiz | null>();
const time = ref<number>(45 * 60);
const timer = ref<string>(formatTime(time.value));

onMounted(async () => {
  const getQuizzesFun = new GetQuizzesFun();
  quizzes.value = await getQuizzesFun.executeAsync();

  quizName.value = (route.query.name as string) || null;
  const quizId = parseInt(route.params.index as string);
  quiz.value = quizzes.value.find((q, i) => i === quizId) || null;
  console.log(quiz.value, 11);
});


const instance = setInterval(() => {
  if (time.value > 0) {
    time.value--;
    timer.value = formatTime(time.value);
  } else {
    clearInterval(instance);
  }
}, 1000);

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const second = seconds % 60;
  return `${minutes < 10 ? '0' : ''}${minutes}:${second < 10 ? '0' : ''}${second}`;
}

onBeforeUnmount(() => {
  clearInterval(instance);
});
</script>
