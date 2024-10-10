<template>
  <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 q-pa-sm">
    <q-card class="br-8">
      <q-card-section>
        <div class="row justify-between items-center">
          <div>
            <div class="quiz-title text-h5">
              <q-icon name="score" size="30px" color="yellow"/>
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
            {{ quiz.teacher }}
            <br />
            <span>{{ quiz.totalPoint }} Points</span>
            <br />
            <span>{{ quiz.description }} Students</span>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-mr-sm">
        <q-btn
          label="Attempt"
          class="w-118 br-8 text-primary"
          no-caps
          outline
           @click="handleQuizClick(index, quiz.name)"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
// import { computed } from 'vue';
import { useRouter } from 'vue-router';
import {Quiz} from 'src/models/QuizzesModel'

const router = useRouter();
defineProps({
  quiz: {
    type: Object as () => Quiz,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});


const handleQuizClick = (index: number, quizName: string) => {
  console.log('Quiz Index: ', index);
  console.log('Quiz Name:', quizName);

  if (index !== undefined) {
    router.push({
      path: `/student/quiz/${index}`,
      query: { name: quizName }
    });
  } else {
    console.error('Quiz index is undefined');
  }
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
