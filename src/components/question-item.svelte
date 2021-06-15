<template lang="pug">
svelte:options(tag="question-item")
.q-item(style="{question.style}")
  h3 { index + 1 }.{ type === 'multi-choice' ? ' [多选题] ' : ' ' }{ question.title }
  +if("type === 'input'")
    input(bind:value="{value}" on:input="{onChange}" "{...attrs}")
  +if("type === 'single-choice'")
    +each("question.items as item (item.value)")
      label
        input(type="radio" name="question.id" value="{item.value}" on:change="{onChange}")
        span { item.label }
  +if("type === 'multi-choice'")
    +each("question.items as item (item.value)")
      label
        input(type="checkbox" name="question.id" value="{item.value}" on:change="{onChange}")
        span { item.label }
</template>

<script>
export let question = {};
export let index = 0;
let value = '';

import { copy } from '@/helper/func';
import { questions } from '@/store/store';

$: questionId = question.id;
$: type = question.type || 'input';
$: attrs = question.attrs || {};

// 值改变时
function onChange(e) {
  const dom = e.path[0];
  const v = dom.value;
  if (type === 'multi-choice') {
    const { checked } = dom;
    if (!value) value = [];
    if (checked) {
      if (value.includes(v)) return;
      // 保持多选答案的顺序
      const newAnswers = [...value, v];
      value = question.items.map(i => i.value).filter(i => newAnswers.includes(i));
    } else {
      const idx = value.indexOf(v);
      if (idx < 0) return;
      value.splice(idx, 1);
    }
  } else {
    value = v;
  }
  const q = $questions.find(q => q.id === questionId);
  q.answer = value;
  question = copy(q);
  $questions = copy($questions);
}
</script>

<style lang="less">
.q-item {
  position: relative;
  overflow: hidden;
  label {
    display: block;
    width: 100%;
    margin: 4px 0;
    line-height: 2em;
    &:hover {
      background-color: #f3f3f3;
    }
    span {
      margin-left: 4px;
      user-select: none;
    }
  }
}
</style>