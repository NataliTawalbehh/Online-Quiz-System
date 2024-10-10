<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="q-mb-md br-8">
      <q-card-section>
        <div class="row justify-between ">
          <div class="row items-center">
            <q-icon name="score" size="50px" color="yellow" />
            <div class="q-mt-lg q-ml-sm">
              <div class="text-h5">{{ quizName }}</div>
              <div class="text-caption text-grey-8 q-mt-xs">
                {{ quizDate }}
              </div>
            </div>
          </div>

          <div class="column justify-center ">
            <div class="q-pb-sm">
              <q-badge text-color="green" color="white" class="q-mr-sm">
                Started: {{ quizStart }}
              </q-badge>
            </div>
            <q-badge text-color="red" color="white" class="q-mr-sm">
              Ended: {{ quizEnd }}
            </q-badge>
          </div>
        </div>
        <q-card-section>
          <div class="row q-gutter-sm ">
            <div class="text-h5"> {{ studentName }}</div>
            <div class="text-h5"> <span class="text-yellow">{{ studentScore }}</span>/{{ totalPoint }}</div>
          </div>
      </q-card-section>
      </q-card-section>



      <div class="q-mb-xl">
        <div class="q-gutter-md">
          <div
            v-for="(question, index) in questions" :key="index"
            class="q-mb-sm flex justify-center"
          >
            <q-card
              flat
              bordered
              class="w-1334 h-325"
              :style="{ borderColor: getBorderColor(index) }"
            >
              <q-card-section>
                <div class="row items-center">
                    <q-icon name="score" size="30px" color="yellow" class="q-mr-sm" />
                    <div class="text-subtitle1">Question {{ index + 1 }}</div>
                  </div>
                <div class="q-mt-sm">{{ question.question }}</div>

                <q-list class="q-mt-sm">
                  <q-item
                    v-for="(option, optionIndex) in question.options" :key="optionIndex"
                  >
                    <q-item-section>
                      <q-radio
                        v-model="selectedOption[index]"
                        :val="option.text"
                        :label="option.text"
                        :class="{
                          'text-green': option.correct,
                          'text-red': selectedOption[index] === option.text && !option.correct,
                        }"
                      />
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </q-card>

    <div class="row justify-end q-mt-lg">
      <q-btn
        label="Close"
        color="red-11"
        @click="closeQuiz"
        class="h-42 w-99 br-8"
        text-color="red"
        no-caps
      />
    </div>
  </q-page>

</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { LocalStorage } from 'quasar';


const router = useRouter();
const route = useRoute();
const quizName = ref('');
const quizDate = ref('');
const quizStart = ref('');
const quizEnd = ref('');
const studentName = ref('');
const studentScore = ref(0);
const totalPoint = ref<number>(0)
const questions = ref<any[]>([]);
const selectedOption = ref<any[]>([]);

onMounted(() => {
  const email = route.query.email as string;
  const name = route.query.name as string;

  const localStorageData = LocalStorage.getItem('allQuizResults') as Record<string, any>;


  const student = localStorageData[email];
  if (student) {

    const quiz = student.quizzes.find((q: any) => q.quiz.name === name);
    if (quiz) {
      studentName.value = student.name.username;
      studentScore.value = quiz.score;
      totalPoint.value = quiz.quiz.totalPoint;
      quizName.value = quiz.quiz.name;
      quizDate.value = quiz.quiz.date;
      quizStart.value = quiz.quiz.start;
      quizEnd.value = quiz.quiz.end;
      questions.value = quiz.questions;
      selectedOption.value = quiz.selectedOption;
    }
  }
});


const getBorderColor = (index: number) => {
  const selectedAnswer = selectedOption.value[index];
  const question = questions.value[index];

  if (!selectedAnswer) {
    return 'transparent';
  }


  if (question.options.some((option: any) => option.text === selectedAnswer && option.correct)) {
    return 'green';
  }

  return 'red';
};

const closeQuiz = () => {
  router.push({ path: '/teacher/quiz' });
};
</script>

<style>
</style>
