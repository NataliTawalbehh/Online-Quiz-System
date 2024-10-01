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
        v-for="(question, index) in quiz.questions"
        :key="question.id"
        :name="index"
        :title="'Question ' + (index + 1)"
        icon="question_answer"
        class="q-mb-lg"
      >
        <div class="q-card__section column">
          <div class="text-h5 q-mb-lg">
            <q-icon name="score" size="40px" color="yellow" />
            Question {{ question.question }}
          </div>
          <div class="text-body1">{{ question.text }}</div>
        </div>

        <div>
          <div
            v-for="option in question.options"
            :key="option"
            class="text-body1"
          >
            <q-radio v-model="selectedOption[`${index}`]" :val="option" />
            {{ option }}
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
          Are you sure!, Once you submit, you cannot go back.
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
import { useRoute } from 'vue-router';
import eventBus from '../../../Event/QuizEventBus';

interface Question {
  id: number;
  question: number;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface Quiz {
  id: number;
  title: string;
  start: string;
  end: string;
  date: string;
  teacher: string;
  points: number;
  students: number;
  status: string;
  questions: Question[];
}

const quizzes = ref<Quiz[]>([
  {
    id: 1,
    title: 'Arabic Quiz',
    start: '08:00 am',
    end: '09:00 am',
    date: '09/09/2024',
    teacher: 'Teacher A',
    points: 50,
    students: 30,
    status: 'active',
    questions: [
      {
        id: 1,
        question: 1,
        text: 'What is the meaning of the word "Shorouq"?',
        options: ['Morning', 'Evening', 'Noon', 'Night'],
        correctAnswer: 'Morning',
      },
      {
        id: 2,
        question: 2,
        text: 'What is the plural of the word "Pen"?',
        options: ['Pens', 'My pens', 'Two pens', 'Pen knife'],
        correctAnswer: 'Pens',
      },
      {
        id: 3,
        question: 3,
        text: 'Complete the sentence: "Knowledge is light and ..."',
        options: [
          'Ignorance is darkness',
          'Wisdom is key',
          'Power is a weapon',
          'Thought is guide',
        ],
        correctAnswer: 'Ignorance is darkness',
      },
    ],
  },

  {
    id: 2,
    title: 'Math Quiz',
    start: '10:00 am',
    end: '11:00 am',
    date: '10/09/2024',
    teacher: 'Teacher B',
    points: 40,
    students: 25,
    status: 'inactive',
    questions: [
      {
        id: 1,
        question: 1,
        text: 'What is the result of 5 × 6?',
        options: ['30', '25', '35', '40'],
        correctAnswer: '30',
      },
      {
        id: 2,
        question: 2,
        text: 'What is the result of 10 ÷ 2?',
        options: ['5', '4', '6', '8'],
        correctAnswer: '5',
      },
      {
        id: 3,
        question: 3,
        text: 'What is the value of π?',
        options: ['3.14', '2.14', '3.41', '4.13'],
        correctAnswer: '3.14',
      },
    ],
  },
  {
    id: 3,
    title: 'Science Quiz',
    start: '01:00 pm',
    end: '02:00 pm',
    date: '11/09/2024',
    teacher: 'Teacher C',
    points: 60,
    students: 20,
    status: 'active',
    questions: [
      {
        id: 1,
        question: 1,
        text: 'What is the unit of energy?',
        options: ['Joule', 'Newton', 'Watt', 'Kilo'],
        correctAnswer: 'Joule',
      },
      {
        id: 2,
        question: 2,
        text: 'Which planet is closest to the Sun?',
        options: ['Mercury', 'Venus', 'Earth', 'Mars'],
        correctAnswer: 'Mercury',
      },
      {
        id: 3,
        question: 3,
        text: 'What is the state of matter when heated strongly?',
        options: ['Gaseous', 'Liquid', 'Solid', 'Plasma'],
        correctAnswer: 'Plasma',
      },
    ],
  },
  {
    id: 4,
    title: 'History Quiz',
    start: '03:00 pm',
    end: '04:00 pm',
    date: '12/09/2024',
    teacher: 'Teacher D',
    points: 55,
    students: 28,
    status: 'active',
    questions: [
      {
        id: 1,
        question: 1,
        text: 'In what year did the French Revolution occur?',
        options: ['1789', '1776', '1804', '1815'],
        correctAnswer: '1789',
      },
      {
        id: 2,
        question: 2,
        text: 'Who was the first president of the United States?',
        options: [
          'George Washington',
          'Abraham Lincoln',
          'Thomas Jefferson',
          'John Kennedy',
        ],
        correctAnswer: 'George Washington',
      },
      {
        id: 3,
        question: 3,
        text: 'Which civilization built the pyramids?',
        options: ['Egyptian', 'Roman', 'Babylonian', 'Chinese'],
        correctAnswer: 'Egyptian',
      },
    ],
  },
  {
    id: 5,
    title: 'Geography Quiz',
    start: '09:00 am',
    end: '10:00 am',
    date: '13/09/2024',
    teacher: 'Teacher E',
    points: 45,
    students: 32,
    status: 'inactive',
    questions: [
      {
        id: 1,
        question: 1,
        text: 'What is the capital of Japan?',
        options: ['Tokyo', 'Beijing', 'Seoul', 'Bangkok'],
        correctAnswer: 'Tokyo',
      },
      {
        id: 2,
        question: 2,
        text: 'What is the largest ocean in the world?',
        options: [
          'Pacific Ocean',
          'Atlantic Ocean',
          'Indian Ocean',
          'Arctic Ocean',
        ],
        correctAnswer: 'Pacific Ocean',
      },
      {
        id: 3,
        question: 3,
        text: 'What is the highest mountain peak in the world?',
        options: ['Everest', 'Kilimanjaro', 'Elbrus', 'McKinley'],
        correctAnswer: 'Everest',
      },
    ],
  },
  {
    id: 6,
    title: 'Physics Quiz',
    start: '11:00 am',
    end: '12:00 pm',
    date: '14/09/2024',
    teacher: 'Teacher F',
    points: 70,
    students: 27,
    status: 'active',
    questions: [
      {
        id: 1,
        question: 1,
        text: 'What is the speed of light in a vacuum?',
        options: [
          '300,000 km/s',
          '150,000 km/s',
          '450,000 km/s',
          '600,000 km/s',
        ],
        correctAnswer: '300,000 km/s',
      },
      {
        id: 2,
        question: 2,
        text: 'What is Newton’s first law?',
        options: [
          'An object in motion stays in motion',
          'Force equals mass times acceleration',
          'For every action there is an equal and opposite reaction',
        ],
        correctAnswer: 'An object in motion stays in motion',
      },
      {
        id: 3,
        question: 3,
        text: 'What is the symbol for acceleration?',
        options: ['a', 'v', 't', 'm'],
        correctAnswer: 'a',
      },
    ],
  },
  {
    id: 7,
    title: 'Chemistry Quiz',
    start: '02:00 pm',
    end: '03:00 pm',
    date: '15/09/2024',
    teacher: 'Teacher G',
    points: 65,
    students: 22,
    status: 'inactive',
    questions: [
      {
        id: 1,
        question: 1,
        text: 'What is the chemical formula of water?',
        options: ['H2O', 'O2', 'CO2', 'H2'],
        correctAnswer: 'H2O',
      },
      {
        id: 2,
        question: 2,
        text: 'What element is found in every organic compound?',
        options: ['Carbon', 'Oxygen', 'Hydrogen', 'Nitrogen'],
        correctAnswer: 'Carbon',
      },
      {
        id: 3,
        question: 3,
        text: 'What is the atomic number of hydrogen?',
        options: ['1', '2', '3', '4'],
        correctAnswer: '1',
      },
    ],
  },
  {
    id: 8,
    title: 'Biology Quiz',
    start: '04:00 pm',
    end: '05:00 pm',
    date: '16/09/2024',
    teacher: 'Teacher H',
    points: 55,
    students: 30,
    status: 'active',
    questions: [
      {
        id: 1,
        question: 1,
        text: 'What is the basic unit of life?',
        options: ['Cell', 'Organ', 'System', 'Tissue'],
        correctAnswer: 'Cell',
      },
      {
        id: 2,
        question: 2,
        text: 'What is the function of DNA?',
        options: [
          'Store genetic information',
          'Transmit nerve signals',
          'Absorb nutrients',
          'Filter blood',
        ],
        correctAnswer: 'Store genetic information',
      },
      {
        id: 3,
        question: 3,
        text: 'Which part of the plant is responsible for photosynthesis?',
        options: ['Leaf', 'Root', 'Stem', 'Flower'],
        correctAnswer: 'Leaf',
      },
    ],
  },
  {
    id: 8,
    title: 'Biology Quiz',
    start: '04:00 pm',
    end: '05:00 pm',
    date: '16/09/2024',
    teacher: 'Teacher H',
    points: 55,
    students: 30,
    status: 'active',
    questions: [
      {
        id: 1,
        question: 1,
        text: 'What is the basic unit of life?',
        options: ['Cell', 'Organ', 'System', 'Tissue'],
        correctAnswer: 'Cell',
      },
      {
        id: 2,
        question: 2,
        text: 'What is the function of DNA?',
        options: [
          'Store genetic information',
          'Transmit nerve signals',
          'Absorb nutrients',
          'Filter blood',
        ],
        correctAnswer: 'Store genetic information',
      },
      {
        id: 3,
        question: 3,
        text: 'Which part of the plant is responsible for photosynthesis?',
        options: ['Leaf', 'Root', 'Stem', 'Flower'],
        correctAnswer: 'Leaf',
      },
    ],
  },
]);

const route = useRoute();
const quiz = ref<Quiz | null>(null);
const currentQuestionIndex = ref<number>(0);
const selectedOption = ref<DataObject>({});
const answers = ref<DataObject>({});
const isSubmitDialogOpen = ref<boolean>(false);

onMounted(() => {
  const quizId = parseInt(route.params.id as string);
  quiz.value = quizzes.value.find((q) => q.id === quizId) || null;

  if (quiz.value) {
    quiz.value.questions.forEach((q, index) => {
      selectedOption.value[`${index}`] = answers.value[index] || '';
    });
  }
});

const isLastQuestion = computed(
  () => currentQuestionIndex.value === (quiz.value?.questions.length || 0) - 1
);

const isFirstQuestion = computed(() => currentQuestionIndex.value === 0);

const goToNextQuestion = () => {
  if (quiz.value) {
    answers.value[currentQuestionIndex.value] =
      selectedOption.value[`${currentQuestionIndex.value}`];

    if (!isLastQuestion.value) {
      currentQuestionIndex.value++;
      selectedOption.value[`${currentQuestionIndex.value}`] =
        answers.value[currentQuestionIndex.value] || '';
    }
  }
  console.log(selectedOption.value);
};

const goToPreviousQuestion = () => {
  if (quiz.value && currentQuestionIndex.value > 0) {
    answers.value[currentQuestionIndex.value] =
      selectedOption.value[`${currentQuestionIndex.value}`];
    currentQuestionIndex.value--;
    selectedOption.value[`${currentQuestionIndex.value}`] =
      answers.value[currentQuestionIndex.value] || '';
  }
};

const openSubmitDialog = () => {
  const score = calculateScore();
  localStorage.setItem('quizScore', score.toString());
  eventBus.score = score;
  eventBus.questions = quiz.value?.questions;
  eventBus.answers = answers;
  eventBus.title = quiz.value?.title;
  eventBus.endQuiz = quiz.value?.end;
  eventBus.startQuiz = quiz.value?.start;
  eventBus.date = quiz.value?.date;
  eventBus.selectedOption = selectedOption;
  isSubmitDialogOpen.value = true;

  console.log(answers.value);
};

const calculateScore = () => {
  let score = 0;
  if (quiz.value) {
    quiz.value.questions.forEach((question, index) => {
      if (selectedOption.value[`${index}`] === question.correctAnswer) {
        score += 10;
      }
    });
  }
  console.log(score);
  return score;
};
</script>

<style scoped></style>
