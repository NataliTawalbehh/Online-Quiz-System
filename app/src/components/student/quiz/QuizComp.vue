<template>
  <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12 q-pa-sm">
    <q-card class="br-8">
      <q-card-section>
        <div class="row justify-between items-center">
          <div>
            <div class="quiz-title text-h5">
              <q-icon name="score" size="30px" color="yellow" />
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
          :disable="isQuizAttempted"
          @click="() => handleQuizClick(index, quiz.name)"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DataObject from 'src/models/DataObject';
import { useRouter } from 'vue-router';
import { LocalStorage, date as quasarDate } from 'quasar';
import { QuizResults, User, Quiz } from 'src/models/Test';

const router = useRouter();
const selectedOption = ref<DataObject>({});
const answers = ref<DataObject>({});

const props = defineProps({
  quiz: {
    type: Object as () => Quiz,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const isQuizAttempted = ref<boolean>(false);

const checkIfQuizAttempted = () => {
  const user = LocalStorage.getItem('user') as User;

  if (!user) {
    console.error('User not found in LocalStorage');
    return;
  }

  const allQuizResults = (LocalStorage.getItem('allQuizResults') || {}) as Record<string, { quizzes: QuizResults[] }>;
  const userEmail = user.email;

  if (allQuizResults[userEmail] && allQuizResults[userEmail].quizzes) {
    isQuizAttempted.value = allQuizResults[userEmail].quizzes.some(
      (result) => result.quiz && result.quiz.name === props.quiz.name
    );
  } else {
    console.log('No quiz results found for user:', userEmail);
    isQuizAttempted.value = false;
  }
};


onMounted(() => {
  checkIfQuizAttempted();
});

const calculateScore = () => {
  let score = 0;
  if (props.quiz) {
    props.quiz.questions.forEach((question, index) => {
      const correctAnswer = question.options.find((opt) => opt.correct)?.text;
      if (selectedOption.value[`${index}`] === correctAnswer) {
        score += question.point;
      }
    });
  }
  console.log(score);
  return score;
};

const handleQuizClick = (index: number, quizName: string) => {
  const score = calculateScore();
  if (!isQuizAttempted.value && index !== undefined) {
    const user = LocalStorage.getItem('user') as User;
    if (!user) {
      console.error('User not found in LocalStorage');
      return;
    }

    const userEmail = user.email;
    let allQuizResults = (LocalStorage.getItem('allQuizquestion') || {}) as Record<string, { quizzes: QuizResults[] }>;

    if (!allQuizResults[userEmail]) {
      allQuizResults[userEmail] = { quizzes: [] };
    }

    const existingQuiz = allQuizResults[userEmail].quizzes.find(
      (quizResult) => quizResult.quiz && quizResult.quiz.name === props.quiz.name
    );

    const quizStartedAt = existingQuiz?.startTimeQuiz ? new Date(existingQuiz.startTimeQuiz).getTime() : Date.now();
    const endQuizTime = new Date(quizStartedAt + 45 * 60 * 1000);
    const formattedEndTime = quasarDate.formatDate(endQuizTime, 'HH:mm');

    if (!existingQuiz) {
      const quizResult: QuizResults = {
        name: {
          username: user.username,
          email: user.email,
          password: user.password,
          isTeacher: user.isTeacher,
          role: user.role,
        },
        quizzes: [{
          quiz: props.quiz,
          score: score,
          questions: props.quiz.questions,
          answer: answers.value,
          selectedOption: selectedOption.value,
          startTimeQuiz: quasarDate.formatDate(quizStartedAt, 'HH:mm'),
          endTimeQuiz: formattedEndTime,
          name: user.username,
        }],
      };

      allQuizResults[userEmail].quizzes.push(quizResult);
      LocalStorage.set('allQuizquestion', allQuizResults);

      router.push({
        path: `/student/quiz/${index}`,
        query: { name: quizName },
      });
    } else {
      const now = Date.now();
      const diffInSeconds = Math.floor((now - quizStartedAt) / 1000);

      if (diffInSeconds < 45 * 60) {
        router.push({
          path: `/student/quiz/${index}`,
          query: { name: quizName },
        });
      } else {
        router.push({
          path: '/score',
        });
        console.log('The time is up for quiz:', props.quiz.name);
      }
    }
  } else {
    console.error('Quiz index is undefined or quiz already attempted');
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
