<template>
  <div class="top-bar flex items-center justify-between px-4 py-3">
    <div class="flex items-center">
      <div class="ml-2">
        <i class="fa fa-lock"></i>
      </div>
    </div>
    <div class="flex items-center ">
      <account-dropdown class="ml-6" />
    </div>
  </div>
</template>

<script>
  import AccountDropdown from '@/components/AccountDropdownComponent'

  export default {
    name: 'top-bar',
    components: {
      AccountDropdown
    }
  }
</script>

<style></style>
