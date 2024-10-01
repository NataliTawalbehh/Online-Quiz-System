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

    <div class="q-mx-md q-mt-lg row items-center justify-between">
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

      <div>
        <q-btn
          label="Filter By Date"
          color="primary"
          outline
          no-caps
          icon="filter_alt"
          @click="onFilterClick"
          class="br-8"
        />

        <q-btn
          v-if="tab === 'quize'"
          label="Create New Quiz"
          color="primary"
          no-caps
          icon="create"
          class="q-ml-md br-8"
          @click="showDialog = true"
        />
      </div>
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
            v-for="(quiz,i) in displayedQuizzes"
            :key="i"
            :quiz="quiz"
            :index="i"
            @delete-quiz="handleDeleteQuiz"
            @update-quiz="handleUpdateQuiz"
          />
        </div>
      </q-tab-panel>
      <q-tab-panel name="result" class="q-pa-none">
        <div class="row col-12">
          <resulte-comp
            v-for="(quiz,i) in displayedQuizzes"
            :key="i"
            :quiz="quiz"
          />
        </div>
      </q-tab-panel>
    </q-tab-panels>

    <div class="row justify-end q-mt-lg">
      <q-btn
        label="See More"
        v-if="displayedQuizzes.length < quizzes.length"
        @click="loadMore"
        class="h-42 w-99 br-8 q-mr-md"
        text-color="light-blue-10"
        color="light-blue-3"
        no-caps
      />
    </div>

    <create-quiz-dialog v-model="showDialog" @add-quiz="addQuiz" />
  </q-page>
</template>

<script setup lang="ts">
import RoutesPaths from 'src/router/RoutesPaths';
import QuizComp from 'src/components/teacher/quiz/QuizComp.vue';
import ResulteComp from 'src/components/teacher/result/ResultComp.vue';
import { ref, computed, onMounted } from 'vue';
import CreateQuizDialog from 'src/components/teacher/quiz/CreateQuizDialog.vue';
import GetQuizzesFun from 'src/functions/GetQuizzesFun';
import { LocalStorage } from 'quasar';

const showDialog = ref(false);
const tab = ref<string>('quize');
const searchQuery = ref<string>('');
const visibleCount = ref<number>(6);

const quizzes = ref<Quiz[]>([]);

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



onMounted(async () => {
  const getQuizzesFun = new GetQuizzesFun();
  quizzes.value = await getQuizzesFun.executeAsync();
  console.log('Quizzes:', quizzes.value);
});




const filteredQuizzes = computed(() => {
  return quizzes.value.filter((quiz) =>
    quiz.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});


const displayedQuizzes = computed(() => {
  return filteredQuizzes.value.slice(0, visibleCount.value);
});

const loadMore = () => {
  visibleCount.value += 6;

};

const handleDeleteQuiz = (index: number) => {
  // const deletedQuiz = quizzes.value[index];
  // quizzes.value.splice(index, 1);

  const storedQuizzes = (LocalStorage.getItem('quizzes') || []) as Quiz[];
  storedQuizzes.splice(index, 1);
  LocalStorage.set('quizzes', storedQuizzes);

  quizzes.value.splice(index, 1);

};

const handleUpdateQuiz = (updatedQuiz: { quiz: Quiz; index: number }) => {
  const index = updatedQuiz.index;
  if (index !== -1) {
    quizzes.value[index] = { ...quizzes.value[index], ...updatedQuiz.quiz };
    LocalStorage.set('quizzes', quizzes.value);
  }
};

const addQuiz = (newQuiz: Quiz) => {
  quizzes.value.unshift(newQuiz);

};

const tabsHeader = ref([
  {
    name: 'quize',
    label: 'Quize',
    to: RoutesPaths.QUIZ_TEACHER,
    icon: 'group',
  },
  {
    name: 'result',
    label: 'Result',
    to: RoutesPaths.RESULT_TEACHER,
    icon: 'computer',
  },
]);

const onFilterClick = () => {
  console.log('Filter by date clicked');
};
</script>
