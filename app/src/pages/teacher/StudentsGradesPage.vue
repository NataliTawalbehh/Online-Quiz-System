<template>
  <q-page>
    <div class="row justify-between q-pa-sm">
      <div class="row items-center">
        <q-icon name="score" size="50px" color="yellow" />
        <div class="q-mt-lg q-ml-sm">
          <div class="text-h5">{{ quizName }}</div>
          <div class="text-caption text-grey-8 q-mt-xs">
            <div v-if="quizDate">{{ quizDate }}</div>
            <div v-else>No Date Available</div>
          </div>
        </div>
      </div>

      <div class="column justify-center ">
        <div class="q-pb-sm">
          <q-badge text-color="green" color="white" class="q-mr-sm">
            <span v-if="quizStart">Started: {{ quizStart }}</span>
            <span v-else>No Start Time Available</span>
          </q-badge>
        </div>
        <q-badge text-color="red" color="white" class="q-mr-sm">
          <span v-if="quizEnd">Ended: {{ quizEnd }}</span>
          <span v-else>No End Time Available</span>
        </q-badge>
      </div>
    </div>

    <div class="q-mx-md q-mt-lg row items-center justify-between">
      <q-input
        v-model="searchQuery"
        placeholder="Search"
        class="q-mr-md"
        flat
        dense
        clearable
        debounce="300"
        borderless
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <div class="q-pa-md">
     <q-table
        flat
        bordered
        :rows="filteredRows"
        :columns="columns"
        row-key="email"
        hide-bottom
        @row-click="handleRowClick"
      >
        <template v-slot:body-cell-score="props">
          <td class="row items-center q-gutter-sm">
            <q-linear-progress
              :value="props.row.score / props.row.totalPoints"
              color="blue"
              track-color="light-grey"
              size="8px"
              style="width: 100px"
            />
            <div>{{ props.row.score }}/{{ props.row.totalPoints }}</div>
          </td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import TableColumn from 'src/models/TableColumn';
import { useRoute, useRouter } from 'vue-router';
import { LocalStorage } from 'quasar';
import {QuizResults, Question} from 'src/models/Test';

const route = useRoute();
const quizName = route.query.name as string;
const students = ref<any[]>([]);
const quizDate = ref('');
const quizStart = ref('');
const quizEnd = ref('');
const questions = ref<Question[]>([]);
const router = useRouter();
const searchQuery = ref<string>('');


const columns = ref<TableColumn[]>([
  {
    name: 'username',
    label: 'Student Name',
    field: 'name',
    align: 'left',
    style: 'width:500px',

  },
  { name: 'score', label: 'Score', field: 'score', align: 'left' },
]);


onMounted(() => {
  const localStorageData = (LocalStorage.getItem('allQuizResults') || {}) as Record<string, QuizResults>;
  console.log('LocalStorage Data:', localStorageData);

  for (const email in localStorageData) {
    const student = localStorageData[email];
    const quizzes = student.quizzes || [];

    const quiz = quizzes.find((quiz) => quiz.quiz.name === quizName);
    if (quiz) {
      students.value.push({
        name: student.name.username,
        score: quiz.score,
        email: email,
        totalPoints: quiz.quiz.totalPoint,
      });

      quizDate.value = quiz.quiz.date;
      quizStart.value = quiz.quiz.start;
      quizEnd.value = quiz.quiz.end;
      questions.value = quiz.questions;
    }
  }
});

const filteredRows = computed(() => {
  if (!searchQuery.value) {
    return students.value; // If no search query, return all students
  }

  const query = searchQuery.value.toLowerCase();
  return students.value.filter(student => {
    return student.name.toLowerCase().includes(query) || student.email.toLowerCase().includes(query);
  });
});
const handleRowClick = (evt: Event, row: { email: string; name: string }) => {
  const { email, name } = row;

  console.log('Email:', email);
  console.log('Username:', name);
  console.log('name:', quizName);
  router.push({
    path: '/score_result',
    query: {
      email: email,
      username: name,
      name:quizName,
    },
  });
};
</script>

<style>
</style>
