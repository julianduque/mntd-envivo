<template>
  <div
    class="sidebar bg-gray-900-spotify w-48 flex-none  flex flex-col justify-between font-semibold"
  >
    <!-- parte 1 Links Generales -->
    <ul class="py-6">
      <li
        v-for="sel in sidebarIndexElems"
        :key="sel.id"
        :class="
          `border-l-4 border-${
            activeRoute() !== sel.route ? 'transparent' : 'green-600'
          }`
        "
      >
        <router-link
          :to="{ name: sel.route }"
          class="flex items-center mx-4 mt-4 group"
        >
          <i :class="`fa fa-${sel.icon} `"></i>
          <span class="ml-2 text-white group-hover:text-white">{{
            sel.name
          }}</span>
        </router-link>
      </li>
    </ul>
    <!-- Parte 2 Categorias -->
    <div class="sidebar-spotify overflow-y-auto px-5 mt-2">
      <div v-for="e in sidebarOtherElms" :key="e.id">
        <h3
          class="uppercase tracking-widest text-gray-500 font-normal text-xs mt-6"
        >
          {{ e.name }}
        </h3>
        <ul
          :class="`leading-extra-loose ${e.name !== 'category' ? 'mb-12' : ''}`"
        >
          <li v-for="sub in e.subitems" :key="sub.id" class="truncate">
            <i :class="`fa fa-${sub.icon}`"></i>
            <a href="" class="ml-2 hover:text-green-700">{{ sub.name }}</a>
          </li>
        </ul>
      </div>
    </div>
    <!-- Parte 3 Logut -->
    <div
      class="border-t border-gray-800 h-16 px-4 py-2 flex items-center group"
    >
      <i class="fa fa-sign-out-alt"></i>
      <a href="" class="ml-2 hover:text-white" @click="logout()">Log out</a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'sidebar',
    data() {
      return {
        sidebarIndexElems: [
          {
            id: Math.random().toString(),
            name: 'Secrets',
            icon: 'lock',
            route: 'secrets'
          }
        ],
        sidebarOtherElms: [
          {
            id: Math.random().toString(),
            name: 'categorys',
            subitems: [
              {
                id: Math.random().toString(),
                name: 'Server',
                icon: 'server',
                filter: 'server'
              },
              {
                id: Math.random().toString(),
                name: 'Services',
                icon: 'signal',
                filter: 'services'
              },
              {
                id: Math.random().toString(),
                name: 'Personal',
                icon: 'users',
                filter: 'personal'
              }
            ]
          },
          {
            id: Math.random().toString(),
            name: 'Gestion',
            subitems: [
              {
                id: Math.random().toString(),
                name: 'Secrets',
                icon: 'plus',
                filter: 'secret-create'
              },
              {
                id: Math.random().toString(),
                name: 'Users',
                icon: 'plus',
                filter: 'user-create'
              }
            ]
          }
        ]
      }
    },

    methods: {
      logout() {
        window.localStorage.clear()
        this.$router.push({ name: 'Login' })
      },
      activeRoute() {
        return this.$route.name
      }
    }
  }
</script>
<style lang="scss">
  .sidebar-spotify::-webkit-scrollbar {
    width: 8px;
    background-color: #121212;
  }

  .sidebar-spotify::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: #535353;
  }
</style>
