<template>
  <div class="bg-gray-800-spotify flex-1  flex flex-col">
    <top-bar />
    <div class="content-spotify overflow-y-auto ">
      <div class="mx-auto container">
        <alert-component v-show="errorMSG.error" :errorMSG="errorMSG" />
        <h2 class="mt-18 text-5xl font-semibold text-white">Secrets</h2>
        <div class="mt-10">
          <h3 class="font-semiblod text-sm border-b border-gray-900 pb-2">
            <strong class="text-xl text-green-300">{{
              user.fullName || user.username
            }}</strong>
            tienes
            <strong class="text-xl text-green-300">{{ data.count }}</strong>
            Secrets
          </h3>
          <div class="flex items-center mt-4 -mx-2" v-if="isHaveSecrets">
            <ul class="flex flex-wrap justify-center">
              <secret
                v-for="(secret, key) in listSecrets"
                :key="secret.name"
                :secret="secret"
                :user="user"
                :indice="key"
                @showError="showError($event)"
              />
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import '@/assets/css/all.min.css'
  import utils from '@/assets/utils/'
  import AlertComponent from '@/components/AlertComponent'
  import TopBar from '@/components/TopBarComponent'
  import Secret from '@/components/SecretComponent'
  import moment from 'moment'
  moment.locale('es')
  export default {
    name: 'secretsContent',
    components: {
      TopBar,
      AlertComponent,
      Secret
    },
    data() {
      return {
        user: {},
        data: {
          count: 0,
          data: []
        },
        errorMSG: {}
      }
    },
    computed: {
      listSecrets() {
        return this.data.data.map(s => {
          s.createdAt = moment(s.createdAt).fromNow()
          return s
        })
      },
      isHaveSecrets() {
        if (this.data.data.length > 0) {
          return true
        } else {
          return false
        }
      }
    },
    async mounted() {
      this.getUserFromLocalStorage()
      if (utils.getItemStorage('secrets')) {
        this.data = utils.getItemStorage('secrets')
      } else {
        this.getSecretsByUsername()
      }
    },
    methods: {
      getUserFromLocalStorage() {
        this.user = utils.getItemStorage('user')
      },
      async getSecretsByUsername() {
        let { username, token } = this.user

        try {
          let res = await utils.getSecrets(username, token)
          if (res.status === 200) {
            this.data = res.data
            utils.saveLocalStorage('secrets', this.data)
          }
        } catch (err) {
          this.errorMSG = err.response.data
          // this.$router.push({ name: 'Login' })
        }
      },
      showError(error) {
        this.errorMSG = error
      }
    }
  }
</script>
<style lang="scss">
  .content-spotify::-webkit-scrollbar {
    width: 8px;
    background-color: #181818;
  }

  .content-spotify::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: #535353;
  }
</style>
