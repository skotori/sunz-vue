<template>
  <div class="iframePage">
    <iframe src="http://localhost:8888/druid" class="iframe"></iframe>
  </div>
</template>

<script>
export default {
  name: 'druid'
}
</script>

<style>
.iframePage {
  width: 100%;
  height: 100%;
}

.iframe {
  border: 0px;
  width: 100%;
  height: 100%;
}
</style>
