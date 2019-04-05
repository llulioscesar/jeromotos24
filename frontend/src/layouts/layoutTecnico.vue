<template>
  <q-layout view="hHh Lpr lFf" style="background:#efefef"> <!-- Be sure to play with the Layout demo on docs -->
    <q-layout-header>
      <q-toolbar class="navbar">
        <q-toolbar-title >
          Jeromotos24
          <span slot="subtitle">Tecnico {{nombre }}</span>
        </q-toolbar-title>
      <q-tabs style="background-color: transparent;" align="right" underline-color="black">
          <q-route-tab slot="title" icon="motorcycle" to="/app/ordenSalida" replace label="Orden Salida" />
          <q-route-tab slot="title" icon="close" to="/" replace label="Salir" />
        </q-tabs>
      </q-toolbar>
    </q-layout-header>
    
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { LocalStorage, SessionStorage } from 'quasar'
export default {
  // name: 'LayoutName',
  data() {
    return {
      leftDrawer: true,
      nombre: null
    };
  },
  beforeMount() {
    this.$nextTick(() => {
     this.nombre = (LocalStorage.get.item("tecnico").nombre)
    })
  }
}
</script>

<style>

.navbar {
 
  background-color: red;
  position: fixed;
  top: 0;
  
}
</style>
