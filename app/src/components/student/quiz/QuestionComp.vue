<template>
  <div
    v-if="quiz"
    class="column items-center color-text line-height font-w font-size font-family"
  >
    <q-stepper
      v-model="currentQuestionIndex"
      flat
      animated
      header="false"
      class="br-8 w-1192 items-center q-mb-xl"
      header-class="none"
    >
      <q-step
        v-for="(question, index) in props.quiz.questions"
        :key="index"
        :name="index"
        :title="'Question ' + (index + 1)"
        icon="question_answer"
        class="q-mb-lg"
      >
        <div class="q-card__section column">
          <div class="text-h6 q-mb-lg text-black" >
            <q-icon name="score" size="30px" color="yellow" />
            Question {{ index + 1 }}
          </div>
        </div>


        <div class="q-card__section column">
          <div class="text-body1 q-mb-lg">

            {{ question.question }}
          </div>
        </div>

        <div>
          <div
            v-for="(option, optionIndex) in question.options"
            :key="optionIndex"
            class="text-body1"
          >
            <q-radio
              v-model="selectedOption[currentQuestionIndex]"
              :val="option.text"
              po
            />
            {{ option.text }}
          </div>
        </div>
      </q-step>
    </q-stepper>
  </div>

  <div class="q-pa-md row justify-between">
    <q-btn
      label="Back"
      color="primary"
      @click="goToPreviousQuestion"
      :disable="isFirstQuestion"
      outline
      class="br-8"
    />
    <q-btn
      v-if="!isLastQuestion"
      label="Next"
      color="primary"
      @click="goToNextQuestion"
      class="br-8"
    />
    <q-btn v-else label="Submit" color="primary" @click="openSubmitDialog" />
  </div>

  <!-- Submission Dialog -->
  <q-dialog v-model="isSubmitDialogOpen" persistent>
    <q-card class="w-600 h-172">
      <q-card-section>
        <div class="text-h6">Submitting the quiz!</div>
        <div class="q-mt-md">
          Are you sure! Once you submit, you cannot go back.
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-mt-md q-mr-sm">
        <q-btn
          label="Cancel"
          color="red"
          class="w-109 br-8"
          v-close-popup
          no-caps
          outline
        />
        <q-btn
          label="Submit"
          color="red"
          class="w-109 br-8"
          @click="submitQuiz"
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import DataObject from 'src/models/DataObject';
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { LocalStorage } from 'quasar';
// import GetAllQuizResults from 'src/functions/GetAllQuizResults';
import {QuizResults, User,Quiz, } from 'src/models/Test'


const currentQuestionIndex = ref<number>(0);
const selectedOption = ref<DataObject>({});
const answers = ref<DataObject>({});
const isSubmitDialogOpen = ref<boolean>(false);

const props = defineProps({
 quiz: {
    type: Object as () => Quiz,
    required: true,
  },
});

onMounted( () => {
  if (props.quiz) {
    props.quiz.questions.forEach((q, index) => {
      selectedOption.value[`${index}`] = answers.value[index] || '';
    });
  }

});

const isLastQuestion = computed(
  () => currentQuestionIndex.value === (props.quiz?.questions.length || 0) - 1
);

const isFirstQuestion = computed(() => currentQuestionIndex.value === 0);


const goToNextQuestion = () => {
  if (props.quiz) {
    answers.value[currentQuestionIndex.value] = selectedOption.value[`${currentQuestionIndex.value}`];
    // LocalStorage.set(`selectedOption_${currentQuestionIndex.value}`, answers.value[currentQuestionIndex.value]);

    if (!isLastQuestion.value) {
      currentQuestionIndex.value++;
      selectedOption.value[`${currentQuestionIndex.value}`] = answers.value[currentQuestionIndex.value] || '';
    }
  }
};

const goToPreviousQuestion = () => {
  if (props.quiz && currentQuestionIndex.value > 0) {
    answers.value[currentQuestionIndex.value] = selectedOption.value[`${currentQuestionIndex.value}`];
    // LocalStorage.set(`selectedOption_${currentQuestionIndex.value}`, answers.value[currentQuestionIndex.value]);
    currentQuestionIndex.value--;
    selectedOption.value[`${currentQuestionIndex.value}`] = answers.value[currentQuestionIndex.value] || '';
  }
};

const openSubmitDialog = async () => {
  const score = calculateScore();
  const user = LocalStorage.getItem('user') as User;
  const userEmail = user.email;

  let allQuizResults = (LocalStorage.getItem('allQuizResults') || {}) as Record<string, QuizResults>;

  // const getAllQuizResults = new GetAllQuizResults();
  // let allQuizResults: QuizResults[] = await getAllQuizResults.executeAsync();

  if (!allQuizResults[userEmail]) {
    allQuizResults[userEmail] = {
      name: {
        username: user.username,
        email: user.email,
        password: user.password,
        isTeacher: user.isTeacher,
        role: user.role
      },
      quizzes: []
    };
  }

  allQuizResults[userEmail].quizzes.push({
    quiz: props.quiz,
    score: score,
    questions: props.quiz.questions,
    answer: answers.value,
    selectedOption: selectedOption.value
  });

  LocalStorage.set('allQuizResults', allQuizResults);


  isSubmitDialogOpen.value = true;
};

import { useRouter } from 'vue-router';

const router = useRouter();

const submitQuiz = () => {
  isSubmitDialogOpen.value = false;

  // هنا نقوم بحساب النتيجة
  const score = calculateScore();

  // حفظ النتيجة في LocalStorage
  const user = LocalStorage.getItem('user') as User;
  const userEmail = user.email;

  let allQuizResults = (LocalStorage.getItem('allQuizResults') || {}) as Record<string, QuizResults>;

  if (!allQuizResults[userEmail]) {
    allQuizResults[userEmail] = {
      name: {
        username: user.username,
        email: user.email,
        password: user.password,
        isTeacher: user.isTeacher,
        role: user.role
      },
      quizzes: []
    };
  }

  allQuizResults[userEmail].quizzes.push({
    quiz: props.quiz,
    score: score,
    questions: props.quiz.questions,
    answer: answers.value,
    selectedOption: selectedOption.value
  });

  LocalStorage.set('allQuizResults', allQuizResults);

  // توجيه المستخدم إلى صفحة النتائج
  router.push({
    path: '/score',
    query: { quizName: props.quiz.name }
  });
};
const time = ref<number>(1 * 60); // تبدأ من دقيقة واحدة (60 ثانية)
const timer = ref<string>(formatTime(time.value)); // تهيئة timer

const instance = setInterval(() => {
  if (time.value > 0) {
    time.value--; // نقص ثانية واحدة
    timer.value = formatTime(time.value); // تحديث الوقت المعروض
  } else {
    clearInterval(instance); // إيقاف المؤقت عندما يصل إلى 0
    submitQuiz(); // استدعاء الدالة الخاصة بتقديم الامتحان
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

const calculateScore = () => {
  let score = 0;
  if (props.quiz) {
    props.quiz.questions.forEach((question, index) => {
      const correctAnswer = question.options.find(opt => opt.correct)?.text;
      if (selectedOption.value[`${index}`] === correctAnswer) {
        score += question.point;
      }
    });
  }
  console.log(score);
  return score;
};
</script>
