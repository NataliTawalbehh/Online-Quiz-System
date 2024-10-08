<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ quizName }}</div>
        <div class="text-caption text-grey-8 q-mt-xs">{{ quizDate }}</div>
        <q-badge text-color="green" color="white" class="q-mt-md">
          Started: {{ quizStart }}
        </q-badge>
        <q-badge text-color="red" color="white" class="q-mt-md">
          Ended: {{ quizEnd }}
        </q-badge>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Student: {{ studentName }}</div>
        <div class="text-h6">Score: {{ studentScore }}</div>
      </q-card-section>

      <q-card-section>
        <div v-for="(question, index) in questions" :key="index" class="q-mb-md">
          <div class="text-h6">{{ index + 1 }}. {{ question.question }}</div>
          <div v-for="(option, optionIndex) in question.options" :key="optionIndex" class="q-mt-xs">
            <q-item>
              <q-item-section>
                <q-item-label>{{ option.text }}</q-item-label>
                <q-item-label v-if="option.correct" class="text-green">
                  (Correct Answer)
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const quizName = ref('');
const quizDate = ref('');
const quizStart = ref('');
const quizEnd = ref('');
const studentName = ref('');
const studentScore = ref(0);
const questions = ref<any[]>([]);

onMounted(() => {
  // الحصول على البيانات من route.query
  const { username, score, quizName: name, end, start, questions: quizQuestions } = route.query;

  // تعيين القيم المناسبة
  quizName.value = name as string;
  quizDate.value = ''; // يمكنك إضافته حسب الحاجة
  quizStart.value = start as string;
  quizEnd.value = end as string;
  studentName.value = username as string; // تأكد من أنك تتلقى القيمة هنا
  studentScore.value = Number(score); // تحويل الدرجة إلى عدد

  // تحويل البيانات إلى مصفوفة
  questions.value = quizQuestions ? JSON.parse(quizQuestions as string) : [];
});
</script>

<style>
/* يمكنك إضافة أي أنماط مخصصة هنا */
</style>
