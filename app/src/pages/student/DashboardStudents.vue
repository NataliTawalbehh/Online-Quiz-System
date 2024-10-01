<template>
  <q-page>
    <q-tabs
      v-model="tab"
      inline-label
      active-bg-color="primary"
      indicator-color="teal"
      active-color="white"
      no-caps
      align="left"
      dense
    >
      <q-route-tab
        v-for="ele in tabsHeader"
        :key="ele.name"
        :name="ele.name"
        :label="ele.label"
        :to="ele.to"
        :icon="ele.icon"
        class="q-ml-md br-8"
      />
    </q-tabs>

    <div class="q-mx-md q-mt-xl row items-center justify-between">
      <q-input
        v-model="searchQuery"
        placeholder="Search"
        class="q-mr-md"
        filled
        flat
        dense
        clearable
        debounce="300"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-btn
        label="Filter By Date"
        color="primary"
        outline
        no-caps
        icon="filter_alt"
        @click="onFilterClick"
      />
    </div>

    <q-tab-panels
      v-model="tab"
      animated
      transition-next="2"
      transition-prev="2"
      class="bg-transparent"
    >
      <q-tab-panel name="quize" class="q-pa-none">
        <div class="row col-12">
          <quiz-comp
            v-for="quiz in filteredQuizzes"
            :key="quiz.id"
            :quiz="quiz"
          />
        </div>
      </q-tab-panel>
      <q-tab-panel name="result" class="q-pa-none">
        <div class="row col-12">
        <resulte-comp
           v-for="quiz in filteredQuizzes"
           :key="quiz.id"
           :quiz="quiz" />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import RoutesPaths from 'src/router/RoutesPaths';
import QuizComp from 'src/components/student/quiz/QuizComp.vue';
import ResulteComp from 'src/components/student/result/ResulteComp.vue';
import { ref, computed } from 'vue';

const tab = ref<string>('quize');
const searchQuery = ref<string>('');

interface Question {
  id: number;
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
  point: string;
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
    point: '40 Point/50 Point',
    students: 30,
    status: 'active',
    questions: [
      {
        id: 1,
        text: 'What is the meaning of the word "Shorouq"?',
        options: ['Morning', 'Evening', 'Noon', 'Night'],
        correctAnswer: 'Morning',
      },
      {
        id: 2,
        text: 'What is the plural of the word "Pen"?',
        options: ['Pens', 'My pens', 'Two pens', 'Pen knife'],
        correctAnswer: 'Pens',
      },
      {
        id: 3,
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
    point: '40 Point/40 Point',
    students: 25,
    status: 'inactive',
    questions: [
      {
        id: 1,
        text: 'What is the result of 5 × 6?',
        options: ['30', '25', '35', '40'],
        correctAnswer: '30',
      },
      {
        id: 2,
        text: 'What is the result of 10 ÷ 2?',
        options: ['5', '4', '6', '8'],
        correctAnswer: '5',
      },
      {
        id: 3,
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
    point: '40 Point/60 Point',
    students: 20,
    status: 'active',
    questions: [
      {
        id: 1,
        text: 'What is the unit of energy?',
        options: ['Joule', 'Newton', 'Watt', 'Kilo'],
        correctAnswer: 'Joule',
      },
      {
        id: 2,
        text: 'Which planet is closest to the Sun?',
        options: ['Mercury', 'Venus', 'Earth', 'Mars'],
        correctAnswer: 'Mercury',
      },
      {
        id: 3,
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
    point: '40 Point/40 Point',
    students: 28,
    status: 'active',
    questions: [
      {
        id: 1,
        text: 'In what year did the French Revolution occur?',
        options: ['1789', '1776', '1804', '1815'],
        correctAnswer: '1789',
      },
      {
        id: 2,
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
    point: '40 Point/40 Point',
    students: 32,
    status: 'inactive',
    questions: [
      {
        id: 1,
        text: 'What is the capital of Japan?',
        options: ['Tokyo', 'Beijing', 'Seoul', 'Bangkok'],
        correctAnswer: 'Tokyo',
      },
      {
        id: 2,
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
    point: '40 Point/50 Point',
    students: 27,
    status: 'active',
    questions: [
      {
        id: 1,
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
    point: '40 Point/50 Point',
    students: 22,
    status: 'inactive',
    questions: [
      {
        id: 1,
        text: 'What is the chemical formula of water?',
        options: ['H2O', 'O2', 'CO2', 'H2'],
        correctAnswer: 'H2O',
      },
      {
        id: 2,
        text: 'What element is found in every organic compound?',
        options: ['Carbon', 'Oxygen', 'Hydrogen', 'Nitrogen'],
        correctAnswer: 'Carbon',
      },
      {
        id: 3,
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
    point: '40 Point/50 Point',
    students: 30,
    status: 'active',
    questions: [
      {
        id: 1,
        text: 'What is the basic unit of life?',
        options: ['Cell', 'Organ', 'System', 'Tissue'],
        correctAnswer: 'Cell',
      },
      {
        id: 2,
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
    point: '40 Point/50 Point',
    students: 30,
    status: 'active',
    questions: [
      {
        id: 1,
        text: 'What is the basic unit of life?',
        options: ['Cell', 'Organ', 'System', 'Tissue'],
        correctAnswer: 'Cell',
      },
      {
        id: 2,
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
        text: 'Which part of the plant is responsible for photosynthesis?',
        options: ['Leaf', 'Root', 'Stem', 'Flower'],
        correctAnswer: 'Leaf',
      },
    ],
  },
]);

const filteredQuizzes = computed<Quiz[]>(() =>
  quizzes.value.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const tabsHeader = ref([
  {
    name: 'quize',
    label: 'Quize',
    to: RoutesPaths.QUIZ,
    icon: 'group',
  },
  {
    name: 'result',
    label: 'Result',
    to: RoutesPaths.RESULTE,
    icon: 'computer',
  },
]);

const onFilterClick = () => {
  console.log('Filter by date clicked');
};
</script>
