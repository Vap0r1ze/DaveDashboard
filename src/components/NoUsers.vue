<template>
  <div class="flex-1 flex items-center justify-center select-none">
    <div class="text-center">
      <p class="ic font-extrabold text-4xl">:(</p>
      <p class="desc text-xl mt-4">No users match your search</p>
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
      darken(themed('bg-dark-2'), 10%),
      lighten(themed('bg-dark-2'), 10%)
    );
  }
}
.desc {
  @include themify {
    color: themed('text-muted');
  }
}
</style>
