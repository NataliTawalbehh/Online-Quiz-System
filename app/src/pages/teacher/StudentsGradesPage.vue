<template>
  <q-page >

    <div class="row justify-between q-pa-sm">
       <div class="row items-center">
         <q-icon name="score" size="50px" color="yellow" />
         <div class="q-mt-lg q-ml-sm">
           <div class="text-h5">{{ students.title }}</div>
           <div class="text-caption text-grey-8 q-mt-xs">{{ students.date }}</div>
        </div>
      </div>


      <div class="q-mt-md">
        <div>
           <q-badge text-color="green" color="white" class="q-mr-sm">
              Started: {{ students.startQuiz }}
           </q-badge>
        </div>
           <q-badge text-color="red" color="white" class="q-mr-sm">
             Ended: {{ students.endQuiz }}
           </q-badge>
        </div>
    </div>

    <div class="q-pa-md">
      <q-input
        filled
        debounce="300"
        v-model="searchQuery"
        placeholder="Search"
        prepend-inner-icon="search"
        clearable
        flat
        dense
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
        row-key="name"
        hide-bottom

      >
        <!-- <template v-slot:body-cell-grade="props">
          <q-linear-progress
            :value="parseFloat(props.row.grade) / 50"
            color="blue"
            track-color="light-blue-2"
            size="sm"
          />
          <span>{{ props.row.grade }}</span>
        </template> -->
      </q-table>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import eventBus from '../../Event/QuizEventBus';

const searchQuery = ref('');

const students = computed(() => {
  return {
    title: eventBus.title,
    startQuiz: eventBus.startQuiz,
    endQuiz: eventBus.endQuiz,
    date: eventBus.date,
  };
});


const columns = ref([
  { name: 'name', label: 'Student Name', field: 'name', align: 'left'},
  { name: 'grade', label: 'Grade', field: 'grade', align: 'left'},
]);

const rows = ref([
  { name: 'Laila Ali Al-Ali', grade: '30/50' },
  { name: 'Saif Mohammad', grade: '40/50' },
  { name: 'Reema Khaled', grade: '20/50' },
  { name: 'Ahmed Hassan', grade: '48/50' },
  { name: 'Sara Ahmed', grade: '35/50' },

]);

const filteredRows = computed(() => {
  if (!searchQuery.value) {
    return rows.value;
  }
  return rows.value.filter((row) => {
    const name = row.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const grade = row.grade.toLowerCase().includes(searchQuery.value.toLowerCase());
    return name || grade;
  });
});

</script>
<style>

</style>
