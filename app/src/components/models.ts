export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

const handelAttempt = (quizName: string) => {
  const existingQuiz = userQuizzes.value.find(
    (entry: newQuiz) => entry.quiz.name === props.quiz.name
  );
  let quizStartedAt: number;
  if (existingQuiz?.quizStartedAt) {
    quizStartedAt = existingQuiz.quizStartedAt;
  } else {
    quizStartedAt = Date.now();
    const newQuizEntry: newQuiz = {
      quiz: props.quiz,
      score: score.value,
      quizStartedAt: quizStartedAt,
      answersObj: allAnswers.value,
    };
    userQuizzes.value.push(newQuizEntry);
    quizInfoByEmail.value[currentUser.value?.email] = {
      user: currentUser.value,
      quizzes: userQuizzes.value,
    } as infoQuiz;
    LocalStorage.set('quizInfoByEmail', quizInfoByEmail.value);
  }
  const now = Date.now();
  const diffInSeconds = Math.floor((now - quizStartedAt) / 1000); // Convert to seconds
  console.log(`Quiz started at: ${quizStartedAt}, Now: ${now}, Diff: ${diffInSeconds} seconds`);
  if (diffInSeconds < 45 * 60) { // 45 minutes = 2700 seconds
    router.push({
      path: RoutesPaths.QUESTIONS,
      query: { quizName: quizName, index: props.i },
    });
  } else {
    router.push({
      path: RoutesPaths.RESULT_PAGE,
      query: { quizName: props.quiz.name },
    });
    console.log('the time is up',props.quiz.name);
  }
};







<template>
  <div
    v-if="quiz"
    class="full-width column  color-text line-height font-w font-size font-family"
  >

    <q-btn
      class="row items-end  font-25 fit"
      flat
      disable
      color="red"
      :label="timer"
      :ripple="false"
      no-caps
    >
      min
    </q-btn>

    <q-stepper
      v-model="currentQuestionIndex"
      flat
      animated
      header="false"
      class="full-width br-8 items-center q-mb-xl"
      header-class="none"
    >
      <q-step
        v-for="(question, index) in props.quiz.questions"
        :key="index"
        :name="index"
        :title="'Question ' + (index + 1)"
        icon="question_answer"
        class="q-mb-lg"
      >
        <div class="q-card__section column">
          <div class="text-h6 q-mb-lg text-black">
            <q-icon name="score" size="30px" color="yellow" />
            Question {{ index + 1 }}
          </div>
        </div>

        <div class="q-card__section column">
          <div class="text-body1 q-mb-lg">
            {{ question.question }}
          </div>
        </div>

        <div>
          <div
            v-for="(option, optionIndex) in question.options"
            :key="optionIndex"
            class="text-body1"
          >
            <q-radio
              v-model="selectedOption[currentQuestionIndex]"
              :val="option.text"
            />
            {{ option.text }}
          </div>
        </div>
      </q-step>
    </q-stepper>
  </div>

  <div class="full-width q-pa-md row justify-between">
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
          Are you sure! Once you submit, you cannot go back.
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
          @click="submitQuiz"
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import DataObject from 'src/models/DataObject';
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { LocalStorage, date as quasarDate } from 'quasar';
import { QuizResults, User, Quiz } from 'src/models/Test';

const currentQuestionIndex = ref<number>(0);
const selectedOption = ref<DataObject>({});
const answers = ref<DataObject>({});
const isSubmitDialogOpen = ref<boolean>(false);
const startTime = ref<string>('');
const endTime = ref<string>('');

const timeNow = new Date();
const formattedTime = quasarDate.formatDate(timeNow, 'HH:mm');
const props = defineProps({
  quiz: {
    type: Object as () => Quiz,
    required: true,
  },
});

onMounted(() => {
  if (props.quiz) {
    props.quiz.questions.forEach((q, index) => {
      selectedOption.value[`${index}`] = answers.value[index] || '';
    });

    // تخزين وقت بدء الاختبار عند أول تحميل للصفحة
    const quizStartedAt = quasarDate.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss'); // التنسيق ISO
    LocalStorage.set('quizStartedAt', quizStartedAt);
  }
});

const isLastQuestion = computed(
  () => currentQuestionIndex.value === (props.quiz?.questions.length || 0) - 1
);

const isFirstQuestion = computed(() => currentQuestionIndex.value === 0);

const goToNextQuestion = () => {
  if (props.quiz) {
    saveCurrentQuestionData();
    saveToLocalStorage();

    if (currentQuestionIndex.value === 0) {
      const now = new Date();
      startTime.value = quasarDate.formatDate(now, 'YYYY-MM-DDTHH:mm:ss'); // ISO format for start time
      const quizDuration = 45 * 60 * 1000; // 45 minutes in milliseconds
      endTime.value = quasarDate.formatDate(new Date(now.getTime() + quizDuration), 'YYYY-MM-DDTHH:mm:ss'); // Calculate and format end time
    }

    if (!isLastQuestion.value) {
      currentQuestionIndex.value++;
      selectedOption.value[`${currentQuestionIndex.value}`] = answers.value[currentQuestionIndex.value]?.selected || '';
    }
  }
};

const saveToLocalStorage = () => {
  const user = LocalStorage.getItem('user') as User;
  const userEmail = user.email;

  let allQuizResults = (LocalStorage.getItem('allQuizResults') || {}) as Record<string, QuizResults>;

  if (!allQuizResults[userEmail]) {
    allQuizResults[userEmail] = {
      name: {
        username: user.username,
        email: user.email,
        password: user.password,
        isTeacher: user.isTeacher,
        role: user.role,
      },
      quizzes: [],
    };
  }

  const currentQuizResults = allQuizResults[userEmail].quizzes.find(
    (q) => q.quiz?.id === props.quiz.id // تأكد من وجود الخاصية id
  );

  if (currentQuizResults) {
    currentQuizResults.answer = answers.value;
    currentQuizResults.selectedOption = selectedOption.value;
    currentQuizResults.questions = props.quiz.questions;
  } else {
    allQuizResults[userEmail].quizzes.push({
      quiz: props.quiz,
      score: 0,
      questions: props.quiz.questions,
      answer: answers.value,
      selectedOption: selectedOption.value,
      startTimeQuiz: startTime.value,
      endTimeQuiz: endTime.value,
      name: user.username,
    });
  }

  LocalStorage.set('allQuizResults', allQuizResults);
};

const saveCurrentQuestionData = () => {
  if (selectedOption.value[currentQuestionIndex.value] !== undefined) {
    answers.value[currentQuestionIndex.value] = {
      selected: selectedOption.value[currentQuestionIndex.value],
      question: props.quiz.questions[currentQuestionIndex.value],
    };
  }
};

const goToPreviousQuestion = () => {
  if (props.quiz && currentQuestionIndex.value > 0) {
    answers.value[currentQuestionIndex.value] =
      selectedOption.value[`${currentQuestionIndex.value}`];
    currentQuestionIndex.value--;
    selectedOption.value[`${currentQuestionIndex.value}`] =
      answers.value[currentQuestionIndex.value]?.selected || ''; // استخدم خاصية selected
  }
};

const openSubmitDialog = async () => {
  const score = calculateScore();
  const user = LocalStorage.getItem('user') as User;
  const userEmail = user.email;

  let allQuizResults = (LocalStorage.getItem('allQuizResults') || {}) as Record<string, QuizResults>;

  if (!allQuizResults[userEmail]) {
    allQuizResults[userEmail] = {
      name: {
        username: user.username,
        email: user.email,
        password: user.password,
        isTeacher: user.isTeacher,
        role: user.role,
      },
      quizzes: [],
    };
  }

  const currentQuizResults = allQuizResults[userEmail].quizzes.find((q) => q.quiz?.id === props.quiz.id); // تأكد من وجود خاصية id
  endTime.value = quasarDate.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss'); // Format end time

  if (currentQuizResults) {
    currentQuizResults.score = score;
    currentQuizResults.answer = answers.value;
    currentQuizResults.selectedOption = selectedOption.value;
    currentQuizResults.startTimeQuiz = startTime.value;
    currentQuizResults.endTimeQuiz = endTime.value;
  } else {
    allQuizResults[userEmail].quizzes.push({
      quiz: props.quiz,
      score: score,
      questions: props.quiz.questions,
      answer: answers.value,
      selectedOption: selectedOption.value,
      startTimeQuiz: startTime.value,
      endTimeQuiz: endTime.value,
      name: user.username,
    });
  }

  LocalStorage.set('allQuizResults', allQuizResults);
  isSubmitDialogOpen.value = true;
};


const time = ref<number>(5 * 60);
const timer = ref<string>(formatTime(time.value));

const instance = setInterval(() => {
  if (time.value > 0) {
    time.value--;
    timer.value = formatTime(time.value);
  } else {
    clearInterval(instance);
    submitQuiz();
  }
}, 1000);

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

onBeforeUnmount(() => {
  clearInterval(instance);
});

const calculateScore = () => {
  let score = 0;
  if (props.quiz) {
    props.quiz.questions.forEach((question, index) => {
      const correctAnswer = question.options.find((opt) => opt.correct)?.text;
      if (selectedOption.value[`${index}`] === correctAnswer) {
        score += question.point;
      }
    });
  }
  console.log(score);
  return score;
};

const submitQuiz = () => {
  // إرسال بيانات الاختبار أو إجراء المعالجة اللازمة بعد تقديم الاختبار
  isSubmitDialogOpen.value = false;
  // يمكنك تنفيذ توجيه أو معالجة أخرى هنا بعد تقديم الاختبار
};

onBeforeUnmount(() => {
  saveToLocalStorage();
});
</script>

<style scoped>
.full-width {
  width: 100%;
}

.line-height {
  line-height: 2;
}

.font-w {
  font-weight: 400;
}

.font-size {
  font-size: 18px;
}

.font-family {
  font-family: 'Arial', sans-serif;
}
</style>


<!--
const time = ref<number>(5 * 60);
const timer = ref<string>(formatTime(time.value));

const instance = setInterval(() => {
  if (time.value > 0) {
    time.value--;
    timer.value = formatTime(time.value);
  } else {
    clearInterval(instance);
    submitQuiz();
  }
}, 1000);

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

onBeforeUnmount(() => {
  clearInterval(instance);
});

const calculateScore = () => {
  let score = 0;
  if (props.quiz) {
    props.quiz.questions.forEach((question, index) => {
      const correctAnswer = question.options.find((opt) => opt.correct)?.text;
      if (selectedOption.value[`${index}`] === correctAnswer) {
        score += question.point;
      }
    });
  }
  console.log(score);
  return score;
}; -->














<template>
  <div
    v-if="quiz"
    class="full-width column  color-text line-height font-w font-size font-family"
  >

    <q-btn
      class="row items-end  font-25 fit"
      flat
      disable
      color="red"
      :label="timer"
      :ripple="false"
      no-caps
    >
      min
    </q-btn>

    <q-stepper
      v-model="currentQuestionIndex"
      flat
      animated
      header="false"
      class="full-width br-8 items-center q-mb-xl"
      header-class="none"
    >
      <q-step
        v-for="(question, index) in props.quiz.questions"
        :key="index"
        :name="index"
        :title="'Question ' + (index + 1)"
        icon="question_answer"
        class="q-mb-lg"
      >
        <div class="q-card__section column">
          <div class="text-h6 q-mb-lg text-black">
            <q-icon name="score" size="30px" color="yellow" />
            Question {{ index + 1 }}
          </div>
        </div>

        <div class="q-card__section column">
          <div class="text-body1 q-mb-lg">
            {{ question.question }}
          </div>
        </div>

        <div>
          <div
            v-for="(option, optionIndex) in question.options"
            :key="optionIndex"
            class="text-body1"
          >
            <q-radio
              v-model="selectedOption[currentQuestionIndex]"
              :val="option.text"
            />
            {{ option.text }}
          </div>
        </div>
      </q-step>
    </q-stepper>
  </div>

  <div class="full-width q-pa-md row justify-between">
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
          Are you sure! Once you submit, you cannot go back.
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
          @click="submitQuiz"
          no-caps
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import DataObject from 'src/models/DataObject';
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import { LocalStorage, date as quasarDate } from 'quasar';
import { QuizResults, User, Quiz } from 'src/models/Test';
import { useRouter } from 'vue-router';

const currentQuestionIndex = ref<number>(0);
const selectedOption = ref<DataObject>({});
const answers = ref<DataObject>({});
const isSubmitDialogOpen = ref<boolean>(false);
const startTime = ref<string>('');
const endTime = ref<string>('');
const router = useRouter();

const timeNow = new Date();
const formattedTime = quasarDate.formatDate(timeNow, 'HH:mm');
const props = defineProps({
  quiz: {
    type: Object as () => Quiz,
    required: true,
  },
});

onMounted(() => {
  if (props.quiz) {
    props.quiz.questions.forEach((q, index) => {
      selectedOption.value[`${index}`] = answers.value[index] || '';
    });

    // تخزين وقت بدء الاختبار عند أول تحميل للصفحة
    const quizStartedAt = quasarDate.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss'); // التنسيق ISO
    LocalStorage.set('quizStartedAt', quizStartedAt);
  }
});

const isLastQuestion = computed(
  () => currentQuestionIndex.value === (props.quiz?.questions.length || 0) - 1
);

const isFirstQuestion = computed(() => currentQuestionIndex.value === 0);

const goToNextQuestion = () => {
  if (props.quiz) {
    saveCurrentQuestionData();
    saveToLocalStorage();

    if (currentQuestionIndex.value === 0) {
      const now = new Date();
      startTime.value = quasarDate.formatDate(now, 'YYYY-MM-DDTHH:mm:ss'); // ISO format for start time
      const quizDuration = 45 * 60 * 1000; // 45 minutes in milliseconds
      endTime.value = quasarDate.formatDate(new Date(now.getTime() + quizDuration), 'YYYY-MM-DDTHH:mm:ss'); // Calculate and format end time
    }

    if (!isLastQuestion.value) {
      currentQuestionIndex.value++;
      selectedOption.value[`${currentQuestionIndex.value}`] = answers.value[currentQuestionIndex.value]?.selected || '';
    }
  }
};

const saveToLocalStorage = () => {
  const user = LocalStorage.getItem('user') as User;
  const userEmail = user.email;
  const score = calculateScore()

  let allQuizResults = (LocalStorage.getItem('allQuizResults') || {}) as Record<string, QuizResults>;

  if (!allQuizResults[userEmail]) {
    allQuizResults[userEmail] = {
      name: {
        username: user.username,
        email: user.email,
        password: user.password,
        isTeacher: user.isTeacher,
        role: user.role,
      },
      quizzes: [],
    };
  }

  const currentQuizResults = allQuizResults[userEmail].quizzes.find(
    (q) => q.quiz?.name === props.quiz.name // استخدام name بدلاً من id
  );

  if (currentQuizResults) {
    currentQuizResults.answer = answers.value;
    currentQuizResults.selectedOption = selectedOption.value;
    currentQuizResults.questions = props.quiz.questions;
  } else {
    allQuizResults[userEmail].quizzes.push({
      quiz: props.quiz,
      score: score,
      questions: props.quiz.questions,
      answer: answers.value,
      selectedOption: selectedOption.value,
      startTimeQuiz: startTime.value,
      endTimeQuiz: endTime.value,
      name: user.username,
    });
  }

  LocalStorage.set('allQuizResults', allQuizResults);
};

const saveCurrentQuestionData = () => {
  if (selectedOption.value[currentQuestionIndex.value] !== undefined) {
    answers.value[currentQuestionIndex.value] = {
      selected: selectedOption.value[currentQuestionIndex.value],
      question: props.quiz.questions[currentQuestionIndex.value],
    };
  }
};

const goToPreviousQuestion = () => {
  if (props.quiz && currentQuestionIndex.value > 0) {
    answers.value[currentQuestionIndex.value] =
      selectedOption.value[`${currentQuestionIndex.value}`];
    currentQuestionIndex.value--;
    selectedOption.value[`${currentQuestionIndex.value}`] =
      answers.value[currentQuestionIndex.value]?.selected || ''; // استخدم خاصية selected
  }
};

const openSubmitDialog = async () => {
  const score = calculateScore();
  const user = LocalStorage.getItem('user') as User;
  const userEmail = user.email;

  let allQuizResults = (LocalStorage.getItem('allQuizResults') || {}) as Record<string, QuizResults>;

  if (!allQuizResults[userEmail]) {
    allQuizResults[userEmail] = {
      name: {
        username: user.username,
        email: user.email,
        password: user.password,
        isTeacher: user.isTeacher,
        role: user.role,
      },
      quizzes: [],
    };
  }

  const currentQuizResults = allQuizResults[userEmail].quizzes.find((q) => q.quiz?.name === props.quiz.name); // استخدام name بدلاً من id
  endTime.value = quasarDate.formatDate(new Date(), 'YYYY-MM-DDTHH:mm:ss'); // تنسيق وقت الانتهاء

  if (currentQuizResults) {
    currentQuizResults.score = score;
    currentQuizResults.answer = answers.value;
    currentQuizResults.selectedOption = selectedOption.value;
    currentQuizResults.startTimeQuiz = startTime.value;
    currentQuizResults.endTimeQuiz = endTime.value;
  } else {
    allQuizResults[userEmail].quizzes.push({
      quiz: props.quiz,
      score: score,
      questions: props.quiz.questions,
      answer: answers.value,
      selectedOption: selectedOption.value,
      startTimeQuiz: startTime.value,
      endTimeQuiz: endTime.value,
      name: user.username,
    });
  }

  LocalStorage.set('allQuizResults', allQuizResults);
  isSubmitDialogOpen.value = true; // فتح حوار التأكيد
};

const time = ref<number>(5 * 60);
const timer = ref<string>(formatTime(time.value));

const instance = setInterval(() => {
  if (time.value > 0) {
    time.value--;
    timer.value = formatTime(time.value);
  } else {
    clearInterval(instance);
    submitQuiz();
  }
}, 1000);

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

onBeforeUnmount(() => {
  clearInterval(instance);
});

const calculateScore = () => {
  let score = 0;
  if (props.quiz) {
    props.quiz.questions.forEach((question, index) => {
      const correctAnswer = question.options.find((opt) => opt.correct)?.text;
      if (selectedOption.value[`${index}`] === correctAnswer) {
        score += question.point;
      }
    });
  }
  console.log(score);
  return score;
};

const submitQuiz = () => {

  isSubmitDialogOpen.value = false;

  saveCurrentQuestionData();
  saveToLocalStorage();

  router.push({
    path: '/score',
    query: { quizName: props.quiz.name },
  });
};


onBeforeUnmount(() => {
  saveToLocalStorage();
});
</script>

<style scoped>
.full-width {
  width: 100%;
}

.line-height {
  line-height: 2;
}

.font-w {
  font-weight: 400;
}

.font-size {
  font-size: 18px;
}

.font-family {
  font-family: 'Arial', sans-serif;
}
</style>




<!-- const submitQuiz = () => {
  isSubmitDialogOpen.value = false;


  const score = calculateScore();

  const user = LocalStorage.getItem('user') as User;
  const userEmail = user.email;

  let allQuizResults = (LocalStorage.getItem('allQuizResults') || {}) as Record<
    string,
    QuizResults
  >;


  if (!allQuizResults[userEmail]) {
    allQuizResults[userEmail] = {
      name: {
        username: user.username,
        email: user.email,
        password: user.password,
        isTeacher: user.isTeacher,
        role: user.role,
      },
      quizzes: [],
    };
  }

  const currentQuizResults = allQuizResults[userEmail].quizzes.find(
    (q) => q.quiz.id === props.quiz.id
  );


  endTime.value = startTime.value + (45 * 60 * 1000);
  const readableEndTime = new Date(endTime.value).getTime();
  console.log('End time of the quiz:', readableEndTime);

  if (currentQuizResults) {
    currentQuizResults.score = score;
    currentQuizResults.answer = answers.value;
    currentQuizResults.selectedOption = selectedOption.value;
    currentQuizResults.startTimeQuiz = startTime.value;
    currentQuizResults.endTimeQuiz = endTime.value;
  } else {
    allQuizResults[userEmail].quizzes.push({
      quiz: props.quiz,
      score: score,
      questions: props.quiz.questions,
      answer: answers.value,
      selectedOption: selectedOption.value,
      startTimeQuiz: startTime.value,
      endTimeQuiz: endTime.value,
      name: user.username,
    });
  }

  LocalStorage.set('allQuizResults', allQuizResults);





  router.push({
    path: '/score',
    query: { quizName: props.quiz.name },
  });
}; -->
