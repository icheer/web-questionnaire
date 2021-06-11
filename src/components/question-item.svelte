<template lang="pug">
svelte:options(tag="question-item")
+if("isVisible")
  h3 { index + 1 }.{ type === 'multi-choice' ? ' [多选题] ' : ' ' }{ question.title }
  +if("type === 'input'")
    input(bind:value="{value}" on:input="{onChange}")
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
import { questions, answers } from '@/store/store';

$: isVisible = getVisibleStatus();
$: type = question.type || 'input';

// 计算显隐状态
function getVisibleStatus() {
  const { props = {} } = question;
  const { showIf } = props;
  if (!showIf) return true;
  const [ qId, answer ] = showIf.split('=');
  return answers[qId] === answer;
}

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
  console.log(value);
}
</script>

<style lang="less">
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
</style>