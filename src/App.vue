<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/cds">CDs</router-link> |
      <router-link to="/gravadoras">Gravadoras</router-link>
    </div>
    <div data-app>
       <router-view />
    </div>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
}
#nav {
  padding: 30px;
  a {
    font-size: 22px;
    font-weight: bold;
    color: #000000;
    &.router-link-exact-active {
      color: #000000;

    }
  }
}
</style>