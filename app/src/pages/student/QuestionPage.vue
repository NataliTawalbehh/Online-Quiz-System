<template>
  <div
    v-if="quizName"
    class="column items-center color-text line-height font-w font-size font-family"
    v-bind="$attrs"
  >
    <div class="quiz-title">
      <h2>{{ quizName }}</h2>
    </div>
  </div>

  <div>
    <q-btn
      class="font-25"
      flat
      disable
      color="red"
      :label="timer"
      :ripple="false"
      style="min-width: 2590px; text-align: center;"
      no-caps
    > min </q-btn>
    <QuestionComp :quiz="quiz" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import QuestionComp from 'src/components/student/quiz/QuestionComp.vue';
import GetQuizzesFun from 'src/functions/GetQuizzesFun';
import {Quiz} from 'src/models/QuizzesModel'

const route = useRoute();
const quizName = ref<string | null>(null);

const quizzes = ref<Quiz[]>([]);


const quiz = ref<Quiz | null >();

onMounted(async () => {
  const getQuizzesFun = new GetQuizzesFun();
  quizzes.value = await getQuizzesFun.executeAsync();

  quizName.value = route.query.name as string || null;
  const quizId = parseInt(route.params.index as string);
  quiz.value = quizzes.value.find((q,i) => i === quizId) || null;
  console.log(quiz.value,11);

});


const time = ref<number>(1 * 60); // تبدأ من دقيقة واحدة (60 ثانية)
const timer = ref<string>(formatTime(time.value)); // تهيئة timer

const instance = setInterval(() => {
  if (time.value > 0) {
    time.value--; // نقص ثانية واحدة
    timer.value = formatTime(time.value); // تحديث الوقت المعروض
  } else {
    clearInterval(instance); // إيقاف المؤقت عندما يصل إلى 0
  }
}, 1000);

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

onBeforeUnmount(() => {
  clearInterval(instance); // إيقاف المؤقت عند تدمير المكون
});
</script>
