<template>
  <div class="flex items-center justify-center">
    <div class="lds-ring global-trans-ignore"><div></div><div></div><div></div><div></div></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import '../variables.scss';

.lds-ring {
  background: {
    image: $load-img;
    position: center;
    size: 150px;
    repeat: no-repeat;
  }
  transition: transform 0.3s ease;
  display: inline-block;
  width: 160px;
  height: 160px;
}
.lds-ring div {
  @include themify {
    border: 8px solid themed('primary');
    border-color: themed('primary') transparent transparent transparent;
  }
  display: block;
  position: absolute;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}
.lds-ring:hover div {
  animation: lds-rainbow 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
.lds-ring:hover {
  transform: scale(1.3);
  background: {
    image: $load-img-2;
  }
}

@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes lds-rainbow {
  0% { border-color: rgba(#ffd145, .7) transparent transparent transparent; transform: rotate(0deg); }
  11% { border-color: rgba(#93ea8c, .7) transparent transparent transparent; }
  30% { border-color: rgba(#68fde2, .7) transparent transparent transparent; }
  49% { border-color: rgba(#6a7bff, .7) transparent transparent transparent; }
  70% { border-color: rgba(#ff8bfe, .7) transparent transparent transparent; }
  89% { border-color: rgba(#ff7774, .7) transparent transparent transparent; }
  100% { border-color: rgba(#ffd145, .7) transparent transparent transparent; transform: rotate(360deg); }
}
</style>
