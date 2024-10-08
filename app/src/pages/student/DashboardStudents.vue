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
            v-for="(quiz,i) in filteredQuizzes"
            :key="i"
            :quiz="quiz" :index="i"
          />
        </div>
      </q-tab-panel>
      <q-tab-panel name="result" class="q-pa-none">
        <div class="row col-12">
        <resulte-comp
           v-for="(quiz,i) in filteredQuizzes"
           :key="i"
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
import { ref, computed, onMounted } from 'vue';
import GetQuizzesFun from 'src/functions/GetQuizzesFun';
const tab = ref<string>('quize');
const searchQuery = ref<string>('');

interface Question {
question:string;
multipleChoices: boolean;
point:number;
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
teacher: string;//local storage
points: number;
students: number;
start: string;
end: string;
status: string;
totalQuestion: number;
totalPoint:number
questions:Question[]
}

const quizzes = ref<Quiz[]>([]);

const filteredQuizzes = computed<Quiz[]>(() =>
  quizzes.value.filter((quiz) =>
    quiz.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

const tabsHeader = ref([
  {
    name: 'quize',
    label: 'Quiz',
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

const fetchQuizzesFromLocalStorage = async () => {
  try {
    const storedQuizzes = new GetQuizzesFun();
    const quizzesData = await storedQuizzes.executeAsync();
    if (quizzesData && quizzesData.length > 0) {
      quizzes.value = quizzesData;
    } else {
      console.log('No quizzes found in Local Storage');
    }
  } catch (error) {
    console.error('Error fetching quizzes:', error);
  }
};

onMounted(() => {
  fetchQuizzesFromLocalStorage();
});

const onFilterClick = () => {
  console.log('Filter by date clicked');
};
</script>
