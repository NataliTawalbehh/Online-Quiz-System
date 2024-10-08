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

    <div class="q-pa-md">
      <q-table
        flat
        bordered
        :rows="filteredRows"
        :columns="columns"
        row-key="email"
        hide-bottom
        @row-click="handleRowClick"
      />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import TableColumn from 'src/models/TableColumn';
import { useRoute, useRouter } from 'vue-router';
import { LocalStorage } from 'quasar';
import DataObject from 'src/models/DataObject';

const route = useRoute();
const quizName = route.query.name as string;
const students = ref<QuizResults[]>([]);
const quizDate = ref('');
const quizStart = ref('');
const quizEnd = ref('');
const questions = ref<Question[]>([]);
const router = useRouter();

// Define the columns for the table
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

onMounted(() => {
  const localStorageData = (LocalStorage.getItem('allQuizResults') || {}) as Record<string, QuizResults>;
  console.log('LocalStorage Data:', localStorageData);

  for (const email in localStorageData) {
    const student = localStorageData[email];
    const quizzes = student.quizzes || [];

    const quiz = quizzes.find((quiz: any) => quiz.quiz.name === quizName);
    if (quiz) {
      students.value.push({
        name: student.name.username,  // Assign the full User object
        score: quiz.score,
        email: email,        // Store email for future reference
      });

      quizDate.value = quiz.quiz.date;
      quizStart.value = quiz.quiz.start;
      quizEnd.value = quiz.quiz.end;
      questions.value = quiz.questions;
    }
  }
});



// Filtered rows based on search query
const filteredRows = computed(() => {
  return students.value;
});

// تعديل دالة handleRowClick هنا لتستقبل الصف الذي تم النقر عليه
const handleRowClick = (row: any) => {
  const quizDetails = {
    username: row.name,  // استخدم الاسم من الصف
    score: row.score,    // استخدم الدرجة من الصف
    quizName: quizName,
    end: quizEnd.value,
    start: quizStart.value,
    questions: JSON.stringify(questions.value),
  };

  console.log(quizDetails);
  router.push({ path: '/score_result', query: quizDetails });
};
</script>

<style>
/* يمكنك إضافة أنماط مخصصة هنا */
</style>
