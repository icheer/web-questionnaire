<template lang="pug">
  svelte:options(tag="web-questionnaire")
  .quiz-wrap
    +if("$quizData.title")
      h2.quiz-title {$quizData.title}
    +if("$quizData.intro")
      p.quiz-intro {$quizData.intro}
    +each("visibleQuestions as q, qIndex (q.id)")
      question-item(question="{q}" index="{qIndex}")
</template>

<script>
  import { onMount, afterUpdate, tick } from 'svelte';
  import { quizData, questions } from '@/store/store';
  import { copy, dispatchEvent } from '@/helper/func';
  import '_/question-item.svelte';

  export let data = [];

  
  $: {
    let shouldRerender = false;
    $questions.forEach(q => {
      const { props = {} } = q;
      const { showIf } = props;
      if (!showIf) return;
      const [qId, answer] = showIf.split(':==');
      const thatQ = $questions.find(q => q.id === qId);
      if (!thatQ) return;
      const flag = thatQ.answer === answer;
      const flagOld = q.isVisible || false;
      if (flag !== flagOld) shouldRerender = true;
      q.isVisible = flag;
    });
    if (shouldRerender) {
      $questions = copy($questions);
    }
  }
  $: visibleQuestions = $questions.filter(q => q.isVisible);

  onMount(() => {
    setTimeout(() => {
      console.log('mounted');
      if (!data || !data.questions) return;
      data.questions.forEach(q => {
        q.isVisible = true;
        q.answer = '';
        q.extraAnswer = '';
        q.realAnswer = '';
        q.style ||= '';
      });
      $quizData = data;
      $questions = data.questions;
    }, 10);
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
