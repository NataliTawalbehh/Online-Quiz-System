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
          <div class="text-h5 q-mb-lg">
            <q-icon name="score" size="40px" color="yellow" />
            Question {{ index + 1 }}: {{ question.question }}
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
          to="/score"
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import DataObject from 'src/models/DataObject';
import { ref, onMounted, computed } from 'vue';
import { LocalStorage } from 'quasar';
import GetAllQuizResults from 'src/functions/GetAllQuizResults';
import eventBus from '../../../Event/QuizEventBus';

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
interface User {
    username: string;
    email: string;
    password: string;
    isTeacher: boolean;
    role: string;
  }

interface QuizResults {
  name: User;
  quizzes: {
    quiz: Quiz;
    score: number;
    questions: Question[];
    answer: DataObject;
    selectedOption: DataObject;
  }[];
}
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

  // تحديث LocalStorage
  LocalStorage.set('allQuizResults', allQuizResults);

  // let userResult = allQuizResults.find(result => result.name.username === user.username);

  // if (!userResult[userEmail]) {
  //   userResult[userEmail] = {
  //     name: {
  //       username: user.username,
  //       email: user.email,
  //       password: user.password,
  //       isTeacher: user.isTeacher,
  //       role: user.role
  //     },
  //     quizzes: []
  //   };
  //   allQuizResults[userEmail].push(userResult);
  // }

  // userResul.quizzes.push({
  //   quiz: props.quiz,
  //   score: score,
  //   questions: props.quiz.questions,
  //   answer: answers.value,
  //   selectedOption: selectedOption.value
  // });

  // LocalStorage.set('allQuizResults', allQuizResults);

  eventBus.score = score;
  eventBus.questions = props.quiz?.questions;
  eventBus.answers = answers.value;
  eventBus.title = props.quiz?.name;
  eventBus.endQuiz = props.quiz?.end;
  eventBus.startQuiz = props.quiz?.start;
  eventBus.date = props.quiz?.date;
  eventBus.selectedOption = selectedOption.value;
  eventBus.totalPoint = props.quiz.totalPoint;

  isSubmitDialogOpen.value = true;
};


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
