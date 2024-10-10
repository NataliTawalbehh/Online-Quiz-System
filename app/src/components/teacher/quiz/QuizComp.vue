<template>
  <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 q-px-md q-mt-md">
    <q-card class="br-8">
      <q-card-section>
        <div class="row justify-between items-center">
          <div>
            <div class="quiz-title text-h5">
              <q-icon name="score" size="30px" color="yellow"/>
              {{ quiz.name }}
            </div>
            <span>{{ quiz.date }}</span>
          </div>
          <div class="column text-caption text-grey">
            <q-badge text-color="green" color="white" class="q-mr-sm">
              Start {{ quiz.start }}
            </q-badge>
            <q-badge text-color="red" color="white" class="q-mr-sm">
              End {{ quiz.end }}
            </q-badge>
          </div>
        </div>

        <div class="q-mt-md" style="color: #262b43">
          <div class="text-body1">
            <span> {{ quiz.totalQuestion }} Total Questions</span>
          </div>
          <div class="text-body1">
            <span>{{ quiz.totalPoint  }} Points</span>
          </div>
          <div class="text-body1">
            <span> {{ quiz.description }} Students</span>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-mr-sm">
        <q-btn
          label="Delete"
          color="red-2"
          text-color="red"
          class="w-118 br-8 q-mr-sm"
          no-caps
          @click="handleDeleteClick"
        />
        <q-btn
          label="Edit"
          color="light-blue-3"
          text-color="light-blue-10"
          class="w-118 br-8"
          no-caps
          @click="openEditDialog"
        />
      </q-card-actions>
    </q-card>


  </div>
   <!-- Edit Quiz Dialog -->
   <q-dialog v-model="showDialog" persistent>
      <q-card class="w-900 hide-scrollbar" align="center">
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
          <div class="text-h6 text-center">Edit Quiz</div>
        </q-card-section>

        <q-card-section class="q-px-xl row items-center">
          <div class="q-pa-sm col-12">
            <q-input v-model="quizDate" outlined dense class="q-mb-md">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="quizeDate" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>

            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time v-model="startTime" mask="HH:mmA" format12h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          </div>

          <div class="q-pa-sm col-12">
            <q-input
              v-model="editQuiz.name"
              label="Quiz Name"
              outlined
              class="q-mb-md"
              dense
            />
          </div>
          <div class="q-pa-sm col-12">
            <q-input
              v-model="editQuiz.description"
              label="Quiz Description"
              outlined
              class="q-mb-md"
              dense
              type="textarea"
            />
          </div>


          <div
            v-for="(question, index) in editQuiz.questions"
            :key="index"
            class="q-mb-md col-12 row"
          >
            <div class="row q-pa-sm col-12">
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
            @click="saveEditQuiz"
            class="w-109"
            v-close-popup
          />
          <q-btn
            outline
            label="Cancel"
            color="red-14"
            no-caps
            class="w-109"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from 'vue';
import {Quiz} from 'src/models/QuizzesModel'


const startTime = ref<string>('');
const quizeDate = ref<string>('');

const quizDate = computed(() => {
  return `${quizeDate.value} ${startTime.value}`;
});


const props = defineProps({
  quiz: {
    type: Object as () => Quiz,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});


const emit = defineEmits(['delete-quiz', 'update-quiz']);

const showDialog = ref<boolean>(false);
const editQuiz = ref<Quiz>({ ...props.quiz });

watch(
  () => props.quiz,
  (newQuiz) => {
    editQuiz.value = { ...newQuiz };  // تأكد من تحديث editQuiz بالقيم الجديدة
  },
  { immediate: true } // التأكد من أن المراقب يتم تشغيله عند أول تحميل.
);
const questions = ref([
  {
    question: '',
    multipleChoices: false,
    point: 0,
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
    point: 0,
    multipleChoices: false,
    options: [
      { text: '', correct: false },
      { text: '', correct: false },
      { text: '', correct: false },
      { text: '', correct: false },
    ],
  });
};

const openEditDialog = () => {
  editQuiz.value = { ...props.quiz };
  showDialog.value = true;
};

const saveEditQuiz = () => {
  emit('update-quiz', { quiz: { ...editQuiz.value }, index: props.index });

  closeEditDialog();
};

const closeEditDialog = () => {
  showDialog.value = false;
};

const handleDeleteClick = () => {
  emit('delete-quiz', props.index);
};

const deleteQuestion = (index: number) => {
  questions.value.splice(index, 1);
};
</script>

<style scoped>

</style>
