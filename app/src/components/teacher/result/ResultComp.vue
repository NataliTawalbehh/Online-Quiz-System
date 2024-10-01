<template>
  <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 q-px-md q-mt-md" @click="navigateToGrade(quiz)">
    <q-card class="br-8"  >
      <q-card-section>
        <div class="row justify-between items-center">
          <div>
            <div class="quiz-title text-h5">
              <q-icon name="score" size="30px" />
              {{ quiz.name }}
            </div>
            <span>{{ quiz.date }}</span>
          </div>
          <div class="column text-caption text-grey">
            <q-badge text-color="green" color="white" class="q-mr-sm">
              Start {{ quiz.start }}
            </q-badge>
            <q-badge text-color="red" color="white" class="q-mr-sm">
              End {{ quiz.end }}
            </q-badge>
          </div>
        </div>

        <div class="q-mt-md" style="color: #262b43">
          <div class="text-body1">
            {{ quiz.description }} Total Questions
            <br />
            <span>{{ quiz.description }} Points</span>
            <br />
            <span>{{ quiz.description }} Students</span>
          </div>
        </div>
      </q-card-section>

    </q-card>
  </div>

</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { useRouter } from 'vue-router';
import eventBus from '../../../Event/QuizEventBus';

const router = useRouter();
defineProps({
  quiz: {
    type: Object as PropType<Quiz>,
    default: {} as Quiz,
  },
  quizzes: {
    type: Array as PropType<Quiz[]>,
    default: () => [],
  },
});


interface Question {

question:string;
multipleChoices: boolean;
point:number;
options: {
  text: string;
  correct: boolean;
};

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
totalQuestion:number;
questions:Question[]
}


const navigateToGrade = (quiz: Quiz) => {
  eventBus.title = quiz.name;
  eventBus.endQuiz = quiz.end;
  eventBus.startQuiz = quiz.start;
  eventBus.date = quiz.date;
  router.push({ path: `/teacher/quiz/${quiz.id}` });
};
</script>

<style scoped>
.q-card {
  max-width: 100%;
  transition: transform 0.3s ease;
}

.q-card-section img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.q-btn {
  width: 100%;
  max-width: 200px;
  font-size: 14px;
}

@media (min-width: 1440px) {
  .q-btn {
    max-width: 118px;
    font-size: 16px;
  }
}
</style>
