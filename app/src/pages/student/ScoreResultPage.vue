<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="q-mb-md br-8">
      <q-card-section>
        <div class="row justify-between q-pa-sm">
          <div>
            <div class="row items-center">
              <q-icon name="score" size="50px" color="yellow" />
              <div class="q-mt-lg q-ml-sm">
                <div class="text-h5">{{ result.title }}</div>
                <div class="text-caption text-grey-8 q-mt-xs">
                  {{ result.date }}
                </div>
              </div>
            </div>
            <div class="text-h2 row justify-start q-ml-sm font-38 font-family">
              {{ result.score }}/{{ result.totalPoint }}
            </div>
          </div>

          <div class="column justify-center q-pb-xl">
            <div class="q-pb-md">
              <q-badge text-color="green" color="white" class="q-mr-sm">
                Started: {{ result.startQuiz }}
              </q-badge>
            </div>
            <q-badge text-color="red" color="white" class="q-mr-sm">
              Ended: {{ result.endQuiz }}
            </q-badge>
          </div>
        </div>
      </q-card-section>

      <div class="q-mb-xl">
        <div class="q-gutter-md">
          <div
            v-for="(question, index) in result.questions"
            :key="index"
            class="q-mb-sm flex justify-center"
          >
            <q-card
              flat
              bordered
              class="w-1334 h-325"
              :style="{ borderColor: getBorderColor(index) }"
            >
              <q-card-section>
                <div class="row justify-between items-center">
                  <div class="text-subtitle1">Question {{ index + 1 }}</div>
                </div>
                <div class="q-mt-sm">{{ question.question }}</div>

                <q-list class="q-mt-sm">
                  <q-item
                    v-for="(option, optionIndex) in question.options"
                    :key="optionIndex"
                  >
                    <q-item-section>
                      <q-radio
                        v-model="eventBus.selectedOption[index]"
                        :val="option.text"
                        :label="option.text"
                        :class="{
                          'text-green': option.correct,
                          'text-red':
                            result.selectedOption[index] === option.text &&
                            !option.correct,
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
import { computed } from 'vue';
import eventBus from '../../Event/QuizEventBus';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Option {
  text: string;
  correct: boolean;
}
interface Question {
  question: string;
  options: Option[];
}

const result = computed(() => {
  return {
    score: eventBus.score,
    questions: eventBus.questions,
    answers: eventBus.answers,
    title: eventBus.title,
    startQuiz: eventBus.startQuiz,
    endQuiz: eventBus.endQuiz,
    date: eventBus.date,
    selectedOption: eventBus.selectedOption,
    totalPoint: eventBus.totalPoint,
  };
});

// const getBorderColor = (index: number) => {
//   if (result.value.selectedOption[index] === result.value.questions[index].options.correct) {
//     return 'green';
//   } else {
//     return 'red';
//   }
// };

const getBorderColor = (index: number) => {
  const selectedAnswer = result.value.selectedOption[index];
  const question: Question = result.value.questions[index];

  const correctAnswer = question.options.find(
    (opt: Option) => opt.correct
  )?.text;

  return selectedAnswer === correctAnswer ? 'green' : 'red';
};

const closeQuiz = () => {
  router.push({ path: '/student/quize' });
};
</script>
