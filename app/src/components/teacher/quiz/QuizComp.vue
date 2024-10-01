<template>
  <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12 q-px-md q-mt-md">
    <q-card class="br-8">
      <q-card-section>
        <div class="row justify-between items-center">
          <div>
            <div class="quiz-title text-h5">
              <q-icon name="score" size="30px" />
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
            <span> {{ totalQuestions }} Total Questions</span>
          </div>
          <div class="text-body1">
            <span>{{ totalPoints }} Points</span>
          </div>
          <div class="text-body1">
            <span> {{ quiz.description }} Students</span>
          </div>
        </div>

        <!-- Show options for the quiz -->
        <!-- <div class="q-mt-md">
          <div v-if="quiz.questions">
            <ul>
              <li v-for="(question, index) in quiz.questions" :key="index">
                <strong>{{ question.question }}:</strong>
                <ul>
                  <li v-for="(option, optIndex) in question.options" :key="optIndex">
                    {{ option.text }} <span v-if="option.correct">(Correct)</span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div> -->
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

    <!-- Edit Quiz Dialog -->
    <q-dialog v-model="showEditDialog" persistent>
      <q-card class="w-800">
        <q-card-section>
          <div class="text-h6 column items-center">Edit Quiz</div>
        </q-card-section>

        <q-card-section class="q-gutter-sm">
          <q-input v-model="editQuiz.name" label="Quiz Title" outlined />
          <q-input v-model="editQuiz.date" label="Date" outlined />
          <q-input v-model="editQuiz.start" label="Start Time" outlined />
          <q-input v-model="editQuiz.end" label="End Time" outlined />
          <q-input
            v-model="editQuiz.description"
            label="description"
            outlined
          />
          <q-input
            v-model.number="editQuiz.points"
            label="Points"
            outlined
            type="number"
          />
          <q-input
            v-model.number="editQuiz.students"
            label="Students"
            outlined
            type="number"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Save" color="green" @click="saveEditQuiz" />
          <q-btn label="Cancel" color="red" flat @click="closeEditDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, computed } from 'vue';

interface Question {
  question: string;
  multipleChoices: boolean;
  point: number;
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
  totalQuestion: number;
  questions: Question[];
}

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

const totalQuestions = computed(() => {
  return props.quiz.questions ? props.quiz.questions.length : 0;
});

const totalPoints = computed(() => {
  let sum = 0;
  if (props.quiz.questions) {
    props.quiz.questions.forEach((question) => {
      sum += question.point;
    });
  }
  return sum;
});

const emit = defineEmits(['delete-quiz', 'update-quiz']);

const showEditDialog = ref(false);
const editQuiz = ref<Quiz>({ ...props.quiz });

watch(
  () => props.quiz,
  (newQuiz) => {
    editQuiz.value = { ...newQuiz };
    console.log(props.index);
    console.log(props.quiz);
  }
);

const openEditDialog = () => {
  editQuiz.value = { ...props.quiz };
  showEditDialog.value = true;
};

const saveEditQuiz = () => {
  console.log('Updated Quiz:', {
    quiz: { ...editQuiz.value },
    index: props.index,
  });
  emit('update-quiz', { quiz: { ...editQuiz.value }, index: props.index });
  closeEditDialog();
};

const closeEditDialog = () => {
  showEditDialog.value = false;
};

const handleDeleteClick = () => {
  emit('delete-quiz', props.index);
};
</script>

<style scoped>
.q-card {
  max-width: 100%;
  transition: transform 0.3s ease;
}

.q-card-section img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.q-btn {
  width: 100%;
  max-width: 200px;
  font-size: 14px;
}

@media (min-width: 1440px) {
  .q-btn {
    max-width: 118px;
    font-size: 16px;
  }
}
</style>
