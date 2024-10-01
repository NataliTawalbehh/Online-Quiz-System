import DataObject from 'src/models/DataObject';
import { reactive } from 'vue';

const eventBus = reactive<DataObject>({
score:0,
questions:[],
answers:{},
title:'',
endQuiz:'',
startQuiz:'',
date:'',
selectedOption:[],
});

export default eventBus;
