<template lang="pug">
  svelte:options(tag="web-questionnaire")
  .quiz-wrap
    +if("$quizData.title")
      h2.quiz-title {$quizData.title}
    +if("$quizData.intro")
      p.quiz-intro {$quizData.intro}
    +each("$questions as q, qIndex (q.id)")
      question-item(question="{q}" index="{qIndex}")
</template>

<script>
  import { onMount, afterUpdate, tick } from 'svelte';
  import { quizData, questions } from '@/store/store';
  import { dispatchEvent } from '@/helper/func';
  import '_/question-item.svelte';

  export let data = [];

  onMount(() => {
    setTimeout(() => {
      console.log('mounted');
      if (!data) return;
      $quizData = data;
      $questions = data.questions || [];
    }, 100);
  });

  // afterUpdate(() => {
  //   if (!columns.length || !data.length) return;
  //   emitEventWhenChanged();
  // });

</script>

<style lang="less">
.quiz-wrap {
  padding: 0 30px;
}
</style>
