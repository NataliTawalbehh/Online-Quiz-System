<template>
  <q-dialog>
    <q-card class="w-900" align="center">
      <q-card-section class="row justify-end">
        <q-btn
          flat
          round
          size="sm"
          dense
          icon="close"
          v-close-popup
          class="float-right"
        />
      </q-card-section>
      <q-card-section class="">
        <div class="text-h6 text-center">Add New Quiz</div>
      </q-card-section>

      <q-card-section class="q-px-xl row items-center">
        <div  class="q-pa-sm col-12" >
         <q-input v-model="quizDate" outlined dense class="q-mb-md" >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="quizDate" mask="YYYY-MM-DD HH:mm">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
              </q-date>
              </q-popup-proxy>
           </q-icon>
         </template>

      <template v-slot:append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm" format24h>
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>


        <!-- <div class="q-pa-sm col-12">
          <q-input
            v-model="quizDate"
            label="Date/Time"
            outlined
            class="q-mb-md"
            dense
          >
            <template v-slot:append>
              <q-icon name="event" />
            </template>

            <q-popup-proxy
              ref="qDateProxy"
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="quizDate" mask="YYYY-MM-DD" />
              <q-time v-model="time" format="24hr" />
            </q-popup-proxy>
          </q-input>
        </div> -->
        <div class="q-pa-sm col-12">
          <q-input
            v-model="quizName"
            label="Quiz Name"
            outlined
            class="q-mb-md"
            dense
          />
        </div>
        <div class="q-pa-sm col-12">
          <q-input
            v-model="quizDescription"
            label="Quiz Description"
            outlined
            class="q-mb-md"
            dense
            type="textarea"
          />
        </div>
        <div
          class="q-pa-sm col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-12"
        ></div>
        <div
          v-for="(question, index) in questions"
          :key="index"
          class="q-mb-md col-12 row"
        >
          <div  class="row q-pa-sm col-12">
            <q-input
              v-model="question.question"
              :label="'Question ' + (index + 1)"
              outlined
              dense
               class="q-mb-md col-8"
            />
            <q-input
             v-model.number="question.point"
             label="Points"
             outlined
             dense
             type="number"
             class="q-mb-md col-4"
            />
          </div>
          <div class="q-mb-md col-12 row justify-end">
            <q-toggle
              v-model="question.multipleChoices"
              label="Student can select more than one choice?"
            />
          </div>
          <div
            class="row q-mb-md q-pa-sm col-12 col-md-6"
            v-for="(item, i) in question.options"
            :key="i"
          >
            <q-input
              v-model="item.text"
              :label="`Option ${i + 1}`"
              outlined
              dense
              class="col"
            >
              <template v-slot:append>
                <q-checkbox v-model="item.correct" />
              </template>
            </q-input>
          </div>
          <div class="q-mt-md">
            <q-btn
              label="Delete"
              color="red"
              @click="deleteQuestion(index)"
              no-caps
              class="q-mt-md br-8 q-ml-sm"
              outline
            />
          </div>
        </div>

        <!-- Add Question Button -->
        <div class="row justify-start">
          <q-btn
            label="Add Question"
            color="indigo-11"
            icon="add"
            class="q-mt-md br-8 q-ml-sm"
            @click="addQuestion"
          />
        </div>
      </q-card-section>

      <q-card-actions align="right" class="margin-right q-mb-lg">
        <q-btn
          label="Save"
          color="light-green-11"
          no-caps
          text-color="light-green-14"
          @click="createQuiz"
          class="w-109"
          v-close-popup
        />
        <q-btn
          outline
          label="Cancel"
          color="red-14"
          no-caps
          @click="closeDialog"
          class="w-109"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { LocalStorage } from 'quasar';

const quizDate = ref<string>('');
const quizName = ref<string>('');
const quizDescription = ref<string>('');
const startTime = ref<string>('');
const showDialog = ref<boolean>(false);
const date = ref<string>('');

const questions = ref([
  {
    question: '',
    multipleChoices: false,
    point:0,
    options: [
      { text: '', correct: false },
      { text: '', correct: false },
      { text: '', correct: false },
      { text: '', correct: false },
    ],
  },

]);

const addQuestion = () => {
  questions.value.push({
    question: '',
    point:0,
    multipleChoices: false,
    options: [
      { text: '', correct: false },
      { text: '', correct: false },
      { text: '', correct: false },
      { text: '', correct: false },
    ],
  });
};

const createQuiz = () => {
  console.log('Quiz Created:', {
    date: quizDate.value,
    name: quizName.value,
    description: quizDescription.value,
    startTime: startTime.value,
    questions: questions.value,
  });

  const newQuiz = {
    date: quizDate.value,
    name: quizName.value,
    description: quizDescription.value,
    startTime: startTime.value,
    questions: questions.value,
  };

  const existingQuizzes = (LocalStorage.getItem('quizzes') || []) as [];

  LocalStorage.set('quizzes', [...existingQuizzes, newQuiz]);


  closeDialog();
};

const closeDialog = () => {
  showDialog.value = false;
};

const deleteQuestion = (index: number) => {
  questions.value.splice(index, 1);
};
</script>

<style scoped></style>
