<template>
  <div class="flex-1 flex items-center justify-center select-none">
    <div class="text-center">
      <p class="ic font-extrabold text-huge">[...]</p>
      <p class="desc text-xl mt-4">This thread has no logs</p>
    </div>
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.ic {
  @include themify {
    color: if(
      $theme == 'light',
      darken(themed('bg-dark-1'), 10%),
      lighten(themed('bg-dark-1'), 10%)
    );
  }
}
.desc {
  @include themify {
    color: themed('text-muted');
  }
}
.text-huge {
  font-size: 3rem;
}
</style>
