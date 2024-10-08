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
      class="margin-left font-25"
      flat
      disable
      color="red"
      :label="timer"
      :ripple="false"
    />
    <QuestionComp :quiz="quiz" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import QuestionComp from 'src/components/student/quiz/QuestionComp.vue';
import GetQuizzesFun from 'src/functions/GetQuizzesFun';

const route = useRoute();
const quizName = ref<string | null>(null);

const quizzes = ref<Quiz[]>([]);

interface Question {
  question: string;
  multipleChoices: boolean;
  point: number;
  options: {
    text: string;
    correct: boolean;
  }[];
}

interface Quiz {
  id: number;
  date: string;
  description: string;
  name: string;
  teacher: string;
  points: number;
  students: number;
  start: string;
  end: string;
  status: string;
  totalQuestion: number;
  totalPoint: number;
  questions: Question[];
}

const quiz = ref<Quiz | null >();

onMounted(async () => {
  const getQuizzesFun = new GetQuizzesFun();
  quizzes.value = await getQuizzesFun.executeAsync();

  quizName.value = route.query.name as string || null;
  const quizId = parseInt(route.params.index as string);
  quiz.value = quizzes.value.find((q,i) => i === quizId) || null;
  console.log(quiz.value,11);

});


const time = ref<number>(45 * 60);
const timer = ref<string>(`${time.value / 60}:${Math.ceil(time.value % 60)}`);

const instance = setInterval(() => {
  timer.value = `${Math.ceil(time.value / 60) < 10 ? '0' : ''}${Math.ceil(
    time.value / 60
  )}:${Math.ceil(time.value % 60) < 10 ? '0' : ''}${Math.ceil(
    time.value % 60
  )}`;
  time.value = time.value - 1;
}, 1000);

onBeforeUnmount(() => {
  clearInterval(instance);
});
</script>
