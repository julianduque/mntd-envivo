,<template>
  <div
    :class="
      `p-2 bg-${
        errorMSG.error === 'Unauthorized' ? 'yellow' : 'red'
      }-800 items-center text-${
        errorMSG.error === 'Unauthorized' ? 'yellow' : 'red'
      }-100 leading-none lg:rounded-full flex lg:inline-flex`
    "
    role="alert"
  >
    <span
      :class="
        `flex rounded-full bg-${
          errorMSG.error === 'Unauthorized' ? 'yellow' : 'red'
        }-500 uppercase px-2 py-1 text-xs font-bold mr-3`
      "
      >{{ errorMSG.statusCode }}</span
    >
    <span class="font-semibold mr-2 text-left flex-auto">{{
      errorMSG.message
    }}</span>
  </div>
</template>

<script>
  export default {
    name: 'AlertComponent',
    props: ['errorMSG']
  }
</script>

<style></style>
