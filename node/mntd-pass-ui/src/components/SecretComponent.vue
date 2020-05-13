<template>
  <!--  -->
  <div>
    <li class="my-2 p-2 ">
      <div
        class="border border-gray-700-spotify max-w-sm mx-auto bg-gray-800-spotify shadow-lg rounded-lg overflow-hidden"
      >
        <div class="sm:flex sm:items-center px-6 py-4">
          <img
            class="w-8 h-8 block mx-auto sm:mx-0 sm:flex-shrink-0 h-16 sm:h-24 rounded-full"
            src="../assets/icons/computadora.svg"
            alt="computer"
          />
          <div class="mt-4 sm:mt-0 sm:ml-4 text-center sm:text-left">
            <p class="text-xl leading-tight">
              <i class="fa fa-lock text-green-700"></i>
              {{ secret.name }}
            </p>
            <p class="text-sm leading-tight text-gray-600">
              <i class="fa fa-clock text-green-700"></i>
              {{ secret.createdAt }}
            </p>
            <div class="mt-4">
              <button
                class="text-green-500 hover:text-white hover:bg-green-500 border border-green-500 text-xs font-semibold rounded-full px-4 py-1 leading-normal"
                @click="
                  changed === false
                    ? getValueFromSecret(secret.name)
                    : copyToClipBoard(indice)
                "
              >
                <i
                  :class="
                    `fa fa-${
                      changed === false ? 'lock' : 'clipboard'
                    } text-green-700`
                  "
                ></i>
                {{ changed === false ? 'Get Secret' : 'Copy Secret' }}
              </button>
              <span>
                <p
                  :class="`text-${isCoping === indice ? 'green' : 'gray'}-700`"
                >
                  {{ value }}
                </p></span
              >
              <input type="hidden" :id="`clipboard-${indice}`" :value="value" />
            </div>
          </div>
        </div>
      </div>
    </li>
  </div>
</template>

<script>
  import utils from '../assets/utils/'

  export default {
    name: 'Secret',
    props: ['secret', 'user', 'indice'],
    data() {
      return {
        value: '',
        isCoping: null,
        msg: null,
        changed: false
      }
    },
    methods: {
      async getValueFromSecret(name) {
        let { username, token } = this.user
        try {
          let res = await utils.getValueSecret(username, name, token)
          if (res.status === 200) {
            this.value = res.data.value
            this.changed = true
          }
        } catch (err) {
          this.$emit('showError', err.response.data)
          this.changed = false
        }
      },
      copyToClipBoard(indice) {
        this.isCoping = indice
        let copyToClibBoard = document.querySelector(`#clipboard-${indice}`)
        copyToClibBoard.setAttribute('type', 'text') // 不是 hidden 才能複製
        copyToClibBoard.select()
        try {
          let successful = document.execCommand('copy')
          this.msg = successful ? 'successful' : 'unsuccessful'
          // Migrar a toast o sweet alert
        } catch (err) {
          this.$emit('showError', {
            statusCode: 500,
            error: 'Faild to Copy'
          })
        }

        /* unselect the range */
        copyToClibBoard.setAttribute('type', 'hidden')
        window.getSelection().removeAllRanges()
      }
    }
  }
</script>
